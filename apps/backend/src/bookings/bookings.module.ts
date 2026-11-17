import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { QueueService } from './queue.service';
import { TriageModule } from '../triage/triage.module';

@Module({
  imports: [TriageModule],
  controllers: [BookingsController],
  providers: [BookingsService, QueueService],
  exports: [BookingsService, QueueService],
})
export class BookingsModule {}
