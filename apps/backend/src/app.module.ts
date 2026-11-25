import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Core Infrastructure Modules
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { StorageModule } from './common/storage/storage.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { NotificationsModule } from './notifications/notifications.module';

// Security, Observability & Audit
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';

// Feature Modules
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { TriageModule } from './triage/triage.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { ClinicalDocsModule } from './clinical-docs/clinical-docs.module';
import { PartnersModule } from './partners/partners.module';
import { AdminModule } from './admin/admin.module';
import { RecordsModule } from './records/records.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    RedisModule,
    StorageModule,
    IntegrationsModule,
    NotificationsModule,
    AuthModule,
    PatientsModule,
    DoctorsModule,
    TriageModule,
    BookingsModule,
    PaymentsModule,
    ConsultationsModule,
    ClinicalDocsModule,
    PartnersModule,
    AdminModule,
    RecordsModule,
    WebhooksModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
