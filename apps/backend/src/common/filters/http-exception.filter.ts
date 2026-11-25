import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  Optional,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ObservabilityAdapter } from '../../integrations/observability.adapter';

/**
 * Global HTTP exception filter with PHI-scrubbed observability reporting.
 */
@Catch()
@Injectable()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  constructor(@Optional() private readonly observability?: ObservabilityAdapter) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse
        ? (exceptionResponse as { message: unknown }).message
        : exception instanceof Error
        ? exception.message
        : 'Internal server error';

    if (status >= 500 && exception instanceof Error) {
      this.logger.error(`[${request.method}] ${request.url} -> ${status}: ${exception.message}`);
      void this.observability?.captureException(exception, {
        method: request.method,
        path: request.url,
        status,
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
