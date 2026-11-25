import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const SENSITIVE_KEYS = new Set([
  'otp',
  'password',
  'token',
  'access_token',
  'refresh_token',
  'authorization',
  'allergies',
  'existing_conditions',
  'current_medications',
  'notes',
  'chief_complaint',
  'phone',
  'email',
]);

/**
 * Observability adapter for Sentry (PHI/PII scrubbed) and Better Stack Logtail structured logging.
 */
@Injectable()
export class ObservabilityAdapter {
  private readonly logger = new Logger(ObservabilityAdapter.name);

  constructor(private readonly configService: ConfigService) {}

  scrubPhi(payload: unknown): unknown {
    if (!payload || typeof payload !== 'object') {
      return payload;
    }
    if (Array.isArray(payload)) {
      return payload.map((item) => this.scrubPhi(item));
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        sanitized[key] = '[REDACTED_PHI]';
      } else if (value && typeof value === 'object') {
        sanitized[key] = this.scrubPhi(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  async captureException(error: Error, context?: Record<string, unknown>): Promise<void> {
    const dsn = this.configService.get<string>('SENTRY_DSN');
    const safeContext = this.scrubPhi(context);
    if (!dsn) {
      this.logger.error(`[SENTRY_SANDBOX] ${error.message}`, JSON.stringify(safeContext));
      return;
    }

    await this.streamLog('ERROR', error.message, {
      stack: error.stack,
      sentry_dsn_configured: true,
      context: safeContext,
    });
  }

  async streamLog(
    level: 'INFO' | 'WARN' | 'ERROR' | 'TRIAGE_ALERT',
    message: string,
    meta?: Record<string, unknown>,
  ): Promise<void> {
    const token = this.configService.get<string>('BETTERSTACK_SOURCE_TOKEN');
    const event = {
      dt: new Date().toISOString(),
      level,
      service: 'manga-healthcare-backend',
      message,
      meta: this.scrubPhi(meta),
    };

    if (!token) {
      return;
    }

    try {
      await fetch('https://in.logs.betterstack.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });
    } catch (err: any) {
      this.logger.warn(`Better Stack log stream failed: ${err?.message}`);
    }
  }
}
