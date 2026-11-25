import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Firebase Cloud Messaging (FCM v1) push notification adapter.
 */
@Injectable()
export class FcmAdapter {
  private readonly logger = new Logger(FcmAdapter.name);

  constructor(private readonly configService: ConfigService) {}

  async sendPush(params: {
    token?: string | null;
    topic?: string;
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<{ delivered: boolean; live: boolean }> {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const accessToken = this.configService.get<string>('FIREBASE_ACCESS_TOKEN');

    if (!projectId || !accessToken || (!params.token && !params.topic)) {
      this.logger.log(`[FCM SANDBOX] "${params.title}" — ${params.body}`);
      return { delivered: true, live: false };
    }

    try {
      const messagePayload: Record<string, unknown> = {
        notification: { title: params.title, body: params.body },
        data: params.data || {},
      };
      if (params.token) {
        messagePayload.token = params.token;
      } else if (params.topic) {
        messagePayload.topic = params.topic;
      }

      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: messagePayload }),
        },
      );
      return { delivered: response.ok, live: true };
    } catch (err: any) {
      this.logger.warn(`FCM push failed: ${err?.message}`);
      return { delivered: false, live: true };
    }
  }
}
