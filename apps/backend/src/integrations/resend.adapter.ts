import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Resend transactional email adapter (Email OTP, payment receipts, E-Prescription PDF attachments).
 */
@Injectable()
export class ResendAdapter {
  private readonly logger = new Logger(ResendAdapter.name);

  constructor(private readonly configService: ConfigService) {}

  async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    attachments?: Array<{ filename: string; content: Buffer }>;
  }): Promise<{ delivered: boolean; live: boolean }> {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    const from =
      this.configService.get<string>('RESEND_FROM_EMAIL') ||
      'Manga Healthcare <no-reply@mangahealthcare.com>';

    if (!apiKey) {
      this.logger.log(`[RESEND SANDBOX] -> ${params.to} | Subject: ${params.subject}`);
      return { delivered: true, live: false };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [params.to],
          subject: params.subject,
          html: params.html,
          attachments: params.attachments?.map((a) => ({
            filename: a.filename,
            content: a.content.toString('base64'),
          })),
        }),
      });
      return { delivered: response.ok, live: true };
    } catch (err: any) {
      this.logger.warn(`Resend email failed: ${err?.message}`);
      return { delivered: false, live: true };
    }
  }
}
