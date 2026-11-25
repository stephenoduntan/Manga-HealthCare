import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * Daily.co / WebRTC room provisioning and role-scoped meeting token adapter.
 */
@Injectable()
export class DailyAdapter {
  private readonly logger = new Logger(DailyAdapter.name);
  private readonly baseUrl = 'https://api.daily.co/v1';

  constructor(private readonly configService: ConfigService) {}

  async createRoom(roomName: string, ttlMinutes = 90): Promise<{ room_name: string; room_url: string; live: boolean }> {
    const apiKey = this.configService.get<string>('DAILY_API_KEY');
    const domain = this.configService.get<string>('DAILY_DOMAIN') || 'manga-healthcare';
    const fallbackUrl = `https://${domain}.daily.co/${roomName}`;

    if (!apiKey || apiKey === '...') {
      return { room_name: roomName, room_url: fallbackUrl, live: false };
    }

    try {
      const exp = Math.floor(Date.now() / 1000) + ttlMinutes * 60;
      const response = await fetch(`${this.baseUrl}/rooms`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roomName,
          privacy: 'private',
          properties: { exp, enable_chat: true, start_video_off: false },
        }),
      });
      const json: any = await response.json();
      if (json?.url) {
        return { room_name: json.name || roomName, room_url: json.url, live: true };
      }
    } catch (err: any) {
      this.logger.warn(`Daily.co createRoom fallback: ${err?.message}`);
    }

    return { room_name: roomName, room_url: fallbackUrl, live: false };
  }

  async createMeetingToken(roomName: string, userId: string, isOwner: boolean): Promise<string> {
    const apiKey = this.configService.get<string>('DAILY_API_KEY');
    const fallbackToken = `call_token_${crypto.randomBytes(16).toString('hex')}`;

    if (!apiKey || apiKey === '...') {
      return fallbackToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/meeting-tokens`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            room_name: roomName,
            user_id: userId,
            is_owner: isOwner,
            exp: Math.floor(Date.now() / 1000) + 5400,
          },
        }),
      });
      const json: any = await response.json();
      if (json?.token) {
        return json.token;
      }
    } catch (err: any) {
      this.logger.warn(`Daily.co token fallback: ${err?.message}`);
    }

    return fallbackToken;
  }
}
