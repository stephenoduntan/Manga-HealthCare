import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ObservabilityAdapter } from '../../integrations/observability.adapter';

/**
 * Structured request/latency logger streaming INFO traces to Better Stack.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly observability: ObservabilityAdapter) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startedAt;
        if (!url?.includes('/health')) {
          this.logger.debug(`${method} ${url} (${durationMs}ms)`);
          void this.observability.streamLog('INFO', `${method} ${url}`, {
            duration_ms: durationMs,
            role: req.user?.role || 'PUBLIC',
          });
        }
      }),
    );
  }
}
