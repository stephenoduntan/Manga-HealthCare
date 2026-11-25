import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Termii Nigeria SMS & DND-bypass OTP adapter.
 */
@Injectable()
export class TermiiAdapter {
  private readonly logger = new Logger(TermiiAdapter.name);
  private readonly baseUrl = 'https://api.ng.termii.com/api';

  constructor(private readonly configService: ConfigService) {}

  async sendOtp(to: string, otp: string): Promise<{ delivered: boolean; live: boolean }> {
    const message = `Your Manga Healthcare verification code is ${otp}. Valid for 10 minutes.`;
    return this.sendSms(to, message, true);
  }

  async sendSms(to: string, message: string, isOtp = false): Promise<{ delivered: boolean; live: boolean }> {
    const apiKey = this.configService.get<string>('TERMII_API_KEY');
    const senderId = this.configService.get<string>('TERMII_SENDER_ID') || 'MangaHealth';

    if (!apiKey) {
      this.logger.log(`[TERMII SANDBOX] -> ${to}: ${message}`);
      return { delivered: true, live: false };
    }

    try {
      const endpoint = isOtp ? `${this.baseUrl}/sms/otp/send` : `${this.baseUrl}/sms/send`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          to,
          from: senderId,
          sms: message,
          type: 'plain',
          channel: 'dnd',
        }),
      });
      return { delivered: response.ok, live: true };
    } catch (err: any) {
      this.logger.warn(`Termii SMS dispatch failed: ${err?.message}`);
      return { delivered: false, live: true };
    }
  }
}
