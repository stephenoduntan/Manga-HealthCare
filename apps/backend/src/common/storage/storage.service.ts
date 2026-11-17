import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly baseUploadDir: string;

  constructor() {
    this.baseUploadDir = path.resolve(process.cwd(), 'uploads');
    this.ensureDirectory(this.baseUploadDir);
    this.ensureDirectory(path.join(this.baseUploadDir, 'prescriptions'));
    this.ensureDirectory(path.join(this.baseUploadDir, 'consultations'));
  }

  private ensureDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  async saveFile(subDir: 'prescriptions' | 'consultations', fileName: string, buffer: Buffer): Promise<string> {
    const targetDir = path.join(this.baseUploadDir, subDir);
    this.ensureDirectory(targetDir);
    const filePath = path.join(targetDir, fileName);

    await fs.promises.writeFile(filePath, buffer);
    this.logger.log(`Stored file locally at ${filePath}`);

    // Return public relative or absolute URL path
    return `/uploads/${subDir}/${fileName}`;
  }

  async getFile(subDir: 'prescriptions' | 'consultations', fileName: string): Promise<Buffer | null> {
    const filePath = path.join(this.baseUploadDir, subDir, fileName);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return await fs.promises.readFile(filePath);
  }

  getFilePath(subDir: 'prescriptions' | 'consultations', fileName: string): string {
    return path.join(this.baseUploadDir, subDir, fileName);
  }
}
