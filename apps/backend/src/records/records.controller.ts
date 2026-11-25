import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { RecordsService } from './records.service';
import { UpdateIntakeDto } from './dto/update-intake.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Controller('api/v1/records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get('patient/:id')
  @Roles('PATIENT', 'DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  async getPatientRecord(
    @Param('id') patientId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (user.role === Role.PATIENT && user.id !== patientId && user.public_id !== patientId) {
      throw new ForbiddenException('Patients can only access their own medical records');
    }
    return this.recordsService.getPatientRecord(patientId);
  }

  @Put('patient/:id/intake')
  @Roles('PATIENT', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async updatePatientIntake(
    @Param('id') patientId: string,
    @Body() dto: UpdateIntakeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (user.role === Role.PATIENT && user.id !== patientId && user.public_id !== patientId) {
      throw new ForbiddenException('Patients can only update their own clinical intake');
    }
    return this.recordsService.updatePatientIntake(patientId, dto);
  }

  @Get('audit')
  @Roles('ADMIN')
  async getAuditLogs() {
    return this.recordsService.getAuditLogs();
  }
}
