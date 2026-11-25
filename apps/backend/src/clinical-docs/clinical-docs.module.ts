import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Module,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ConsultationsModule } from '../consultations/consultations.module';
import { ConsultationsService } from '../consultations/consultations.service';
import { SaveNotesDto } from '../consultations/dto/save-notes.dto';
import { CreatePrescriptionDto } from '../consultations/dto/create-prescription.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { S3Adapter } from '../integrations/s3.adapter';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { MdcnVerifiedGuard } from '../common/guards/mdcn-verified.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RequireMdcnVerified } from '../common/decorators/mdcn-verified.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { AuditTarget } from '../common/decorators/audit-target.decorator';

@Controller('api/v1/clinical-docs')
@UseGuards(JwtAuthGuard, RolesGuard, MdcnVerifiedGuard)
export class ClinicalDocsController {
  constructor(
    private readonly consultationsService: ConsultationsService,
    private readonly prisma: PrismaService,
    private readonly s3Adapter: S3Adapter,
  ) {}

  @Put(':consultationId/notes')
  @Roles('DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @RequireMdcnVerified()
  @AuditTarget('consultations')
  @HttpCode(HttpStatus.OK)
  async saveSoapNotes(
    @Param('consultationId') consultationId: string,
    @Body() dto: SaveNotesDto,
  ) {
    return this.consultationsService.saveNotes(consultationId, dto);
  }

  @Post(':consultationId/prescriptions')
  @Roles('DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @RequireMdcnVerified()
  @AuditTarget('prescriptions')
  @HttpCode(HttpStatus.CREATED)
  async createPrescription(
    @Param('consultationId') consultationId: string,
    @Body() dto: CreatePrescriptionDto,
    @CurrentUser() doctorUser: AuthenticatedUser,
  ) {
    return this.consultationsService.issuePrescription(consultationId, dto, doctorUser);
  }

  @Post(':consultationId/referrals')
  @Roles('DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @RequireMdcnVerified()
  @AuditTarget('consultations')
  @HttpCode(HttpStatus.OK)
  async attachReferralOrLabs(
    @Param('consultationId') consultationId: string,
    @Body() body: { referral_note?: string; lab_requests?: unknown },
  ) {
    return this.consultationsService.saveReferralAndLabs(consultationId, body);
  }

  @Get('prescriptions/:id/download')
  @Roles('PATIENT', 'DOCTOR', 'LOCUM', 'THERAPIST', 'PARTNER', 'ADMIN')
  @AuditTarget('prescriptions')
  async getPrescriptionDownloadUrl(@Param('id') prescriptionId: string) {
    let consultationId = prescriptionId;
    let storedPdfUrl: string | null = null;

    if (this.prisma.isConnected) {
      const rx = await this.prisma.prescription.findUnique({
        where: { id: prescriptionId },
      });
      if (rx) {
        consultationId = rx.consultation_id;
        storedPdfUrl = rx.generated_pdf_url;
      }
    }

    const fallbackRoute = `/api/v1/consultations/${consultationId}/prescription/pdf`;
    if (storedPdfUrl) {
      const signedUrl = await this.s3Adapter.createPresignedDownloadUrl(storedPdfUrl, fallbackRoute);
      return {
        prescription_id: prescriptionId,
        download_url: signedUrl,
        expires_in_seconds: 300,
      };
    }

    const memRx = await this.consultationsService.getPrescriptionRecord(prescriptionId);
    if (!memRx) {
      throw new NotFoundException(`Prescription ${prescriptionId} not found`);
    }

    const signedUrl = memRx.generated_pdf_url
      ? await this.s3Adapter.createPresignedDownloadUrl(
          memRx.generated_pdf_url,
          `/api/v1/consultations/${memRx.consultation_id}/prescription/pdf`,
        )
      : `/api/v1/consultations/${memRx.consultation_id}/prescription/pdf`;

    return {
      prescription_id: prescriptionId,
      download_url: signedUrl,
      expires_in_seconds: 300,
    };
  }
}

@Module({
  imports: [ConsultationsModule],
  controllers: [ClinicalDocsController],
})
export class ClinicalDocsModule {}
