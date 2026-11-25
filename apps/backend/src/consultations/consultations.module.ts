import { Module } from '@nestjs/common';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { PdfService } from './pdf.service';
import { ConsultationChatGateway } from './chat.gateway';

@Module({
  controllers: [ConsultationsController],
  providers: [ConsultationsService, PdfService, ConsultationChatGateway],
  exports: [ConsultationsService, PdfService, ConsultationChatGateway],
})
export class ConsultationsModule {}
