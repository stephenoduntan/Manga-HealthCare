import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuditTarget } from '../common/decorators/audit-target.decorator';

@Controller('api/v1/partners')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get('lookup/:patientPublicId')
  @Roles('PARTNER', 'ADMIN', 'DOCTOR', 'LOCUM')
  @AuditTarget('prescriptions')
  async lookupPatientRecords(
    @Param('patientPublicId') patientPublicId: string,
    @CurrentUser('id') partnerUserId: string,
  ) {
    return this.partnersService.lookupPatientRecords(patientPublicId, partnerUserId);
  }

  @Patch('prescriptions/:id/fulfill')
  @Roles('PARTNER', 'ADMIN')
  @AuditTarget('prescriptions')
  @HttpCode(HttpStatus.OK)
  async fulfillPrescription(
    @Param('id') prescriptionId: string,
    @CurrentUser('id') partnerUserId: string,
  ) {
    return this.partnersService.fulfillPrescription(prescriptionId, partnerUserId);
  }
}
