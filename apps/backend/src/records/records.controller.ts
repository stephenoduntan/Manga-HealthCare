import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { UpdateIntakeDto } from './dto/update-intake.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/v1/records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get('patient/:id')
  async getPatientRecord(@Param('id') patientId: string) {
    return this.recordsService.getPatientRecord(patientId);
  }

  @Put('patient/:id/intake')
  @HttpCode(HttpStatus.OK)
  async updatePatientIntake(
    @Param('id') patientId: string,
    @Body() dto: UpdateIntakeDto,
  ) {
    return this.recordsService.updatePatientIntake(patientId, dto);
  }

  @Get('audit')
  @Roles('ADMIN')
  async getAuditLogs() {
    return this.recordsService.getAuditLogs();
  }
}
