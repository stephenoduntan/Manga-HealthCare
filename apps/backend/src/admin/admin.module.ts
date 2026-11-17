import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TriageModule } from '../triage/triage.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [TriageModule, BookingsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
