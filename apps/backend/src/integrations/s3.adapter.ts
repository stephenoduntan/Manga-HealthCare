import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService } from '../common/storage/storage.service';

/**
 * Encrypted AWS S3 adapter (AES256 SSE + 5-minute signed download URLs) with local StorageService fallback.
 */
@Injectable()
export class S3Adapter {
  private readonly logger = new Logger(S3Adapter.name);
  private readonly client: S3Client | null;
  private readonly bucket: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
  ) {
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const region = this.configService.get<string>('AWS_REGION') || 'eu-west-1';
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET') || 'manga-healthcare-documents';

    if (accessKeyId && secretAccessKey && accessKeyId !== '...' && secretAccessKey !== '...') {
      this.client = new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
      });
    } else {
      this.client = null;
    }
  }

  async uploadEncryptedFile(
    folder: 'prescriptions' | 'consultations',
    fileName: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    const localUrl = await this.storageService.saveFile(folder, fileName, buffer);
    if (!this.client) {
      return localUrl;
    }

    const key = `${folder}/${fileName}`;
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          ServerSideEncryption: 'AES256',
        }),
      );
      return `s3://${this.bucket}/${key}`;
    } catch (err: any) {
      this.logger.warn(`S3 upload failed (${err?.message}); falling back to local path.`);
      return localUrl;
    }
  }

  async createPresignedUploadUrl(
    folder: 'prescriptions' | 'consultations',
    fileName: string,
    contentType = 'image/jpeg',
  ): Promise<{ upload_url: string; file_key: string; expires_in_seconds: number; s3_enabled: boolean }> {
    const key = `${folder}/${fileName}`;
    if (!this.client) {
      return {
        upload_url: `/uploads/${key}`,
        file_key: key,
        expires_in_seconds: 300,
        s3_enabled: false,
      };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
      ServerSideEncryption: 'AES256',
    });
    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 300 });
    return {
      upload_url: uploadUrl,
      file_key: key,
      expires_in_seconds: 300,
      s3_enabled: true,
    };
  }

  async createPresignedDownloadUrl(storedUrl: string, fallbackRoute: string): Promise<string> {
    if (!this.client || !storedUrl.startsWith('s3://')) {
      return fallbackRoute;
    }

    const withoutScheme = storedUrl.replace(/^s3:\/\//, '');
    const slashIdx = withoutScheme.indexOf('/');
    const key = slashIdx >= 0 ? withoutScheme.slice(slashIdx + 1) : withoutScheme;

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn: 300 });
  }
}
