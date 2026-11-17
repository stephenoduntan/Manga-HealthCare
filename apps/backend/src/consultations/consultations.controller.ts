import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpCode,
  HttpStatus,
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

@Controller('api/v1/consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post('start')
  @HttpCode(HttpStatus.OK)
  async startSession(
    @Body() dto: StartConsultationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.consultationsService.startSession(dto, userId);
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
