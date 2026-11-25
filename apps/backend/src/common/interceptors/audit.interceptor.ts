import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, params } = request;

    // Check if the route accesses audited clinical or patient records
    const isAuditedRoute =
      url.includes('/consultations') ||
      url.includes('/clinical-docs') ||
      url.includes('/records') ||
      url.includes('/partners') ||
      url.includes('/prescriptions') ||
      url.includes('/patients') ||
      url.includes('/triage') ||
      url.includes('/bookings') ||
      url.includes('/doctors');

    return next.handle().pipe(
      tap(async () => {
        if (!isAuditedRoute) return;

        const userId = user?.id || user?.sub || '00000000-0000-0000-0000-000000000000';
        let action = `${method}_${url.split('?')[0].split('/').slice(2, 5).join('_').toUpperCase()}`;

        if (url.includes('/partners/lookup')) {
          action = 'PRESCRIPTION_LOOKUP_PARTNER';
        } else if (url.includes('/triage/evaluate')) {
          action = 'TRIAGE_EVALUATION';
        } else if (url.includes('/prescriptions')) {
          action = method === 'POST' ? 'PRESCRIPTION_ISSUED' : 'READ_PATIENT_RECORD';
        } else if (url.includes('/consultations')) {
          if (method === 'POST' && url.includes('/start')) action = 'CONSULTATION_STARTED';
          else if (method === 'POST' && url.includes('/end')) action = 'CONSULTATION_ENDED';
          else if (method === 'PATCH' || method === 'PUT') action = 'CLINICAL_NOTE_SAVED';
          else action = 'READ_PATIENT_RECORD';
        } else if (url.includes('/bookings')) {
          action = method === 'POST' ? 'BOOKING_CREATED' : 'READ_PATIENT_RECORD';
        }

        const targetRecord = params?.id || params?.patientPublicId || url;

        try {
          if (this.prisma.isConnected) {
            await this.prisma.auditLog.create({
              data: {
                user_id: userId,
                action,
                target_record: targetRecord,
                timestamp: new Date(),
              },
            });
          }
          this.logger.log(
            `[NDPR AUDIT] User: ${userId} | Action: ${action} | Target: ${targetRecord}`,
          );
        } catch (err: any) {
          this.logger.warn(`Failed to write NDPR audit log: ${err?.message}`);
        }
      }),
    );
  }
}

export { AuditInterceptor as NdprAuditLogInterceptor };
