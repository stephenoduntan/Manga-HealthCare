import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/v1/partners')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get('lookup/:patientPublicId')
  @Roles('PARTNER', 'ADMIN', 'DOCTOR', 'LOCUM')
  async lookupPatientRecords(
    @Param('patientPublicId') patientPublicId: string,
    @CurrentUser('id') partnerUserId: string,
  ) {
    return this.partnersService.lookupPatientRecords(patientPublicId, partnerUserId);
  }
}
