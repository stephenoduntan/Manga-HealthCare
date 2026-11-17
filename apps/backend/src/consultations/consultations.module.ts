import { Module } from '@nestjs/common';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { PdfService } from './pdf.service';

@Module({
  controllers: [ConsultationsController],
  providers: [ConsultationsService, PdfService],
  exports: [ConsultationsService, PdfService],
})
export class ConsultationsModule {}
