import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ConsultationsService } from './consultations.service';
import { StartConsultationDto } from './dto/start-consultation.dto';
import { SaveNotesDto } from './dto/save-notes.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { AuditTarget } from '../common/decorators/audit-target.decorator';

@Controller('api/v1/consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post(':bookingId/start')
  @Roles('PATIENT', 'DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @AuditTarget('consultations')
  @HttpCode(HttpStatus.OK)
  async startSessionByBookingId(
    @Param('bookingId') bookingId: string,
    @Body() body: Partial<StartConsultationDto>,
    @CurrentUser('id') userId: string,
  ) {
    return this.consultationsService.startSession(
      { booking_id: bookingId, mode: body?.mode },
      userId,
    );
  }

  @Post('start')
  @HttpCode(HttpStatus.OK)
  async startSession(
    @Body() dto: StartConsultationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.consultationsService.startSession(dto, userId);
  }

  @Get(':id/patient-context')
  @Roles('DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @AuditTarget('patient_profiles')
  async getPatientContext(
    @Param('id') consultationId: string,
    @CurrentUser('id') doctorId: string,
  ) {
    return this.consultationsService.getPatientContext(consultationId, doctorId);
  }

  @Post(':id/attachments')
  @Roles('PATIENT', 'DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  @AuditTarget('consultations')
  @HttpCode(HttpStatus.OK)
  async handleAttachment(
    @Param('id') consultationId: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: { filename?: string; content_type?: string },
  ) {
    if (file) {
      return this.consultationsService.uploadImage(consultationId, file);
    }
    return this.consultationsService.requestAttachmentPresignedUrl(
      consultationId,
      body?.filename || 'clinical-attachment.jpg',
      body?.content_type || 'image/jpeg',
    );
  }

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async uploadImage(
    @Param('id') consultationId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.consultationsService.uploadImage(consultationId, file);
  }

  @Post(':id/notes')
  @Roles('DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async saveNotes(
    @Param('id') consultationId: string,
    @Body() dto: SaveNotesDto,
  ) {
    return this.consultationsService.saveNotes(consultationId, dto);
  }

  @Post(':id/prescriptions')
  @Roles('DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async issuePrescription(
    @Param('id') consultationId: string,
    @Body() dto: CreatePrescriptionDto,
    @CurrentUser() doctorUser: AuthenticatedUser,
  ) {
    return this.consultationsService.issuePrescription(consultationId, dto, doctorUser);
  }

  @Post(':id/end')
  @Roles('DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async endSession(@Param('id') consultationId: string) {
    return this.consultationsService.endSession(consultationId);
  }

  @Get(':id')
  async getConsultation(@Param('id') consultationId: string) {
    return this.consultationsService.getConsultation(consultationId);
  }

  @Get(':id/prescription/pdf')
  async downloadPrescriptionPdf(
    @Param('id') consultationId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.consultationsService.getPrescriptionPdfBuffer(consultationId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=prescription-${consultationId.slice(0, 8)}.pdf`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
