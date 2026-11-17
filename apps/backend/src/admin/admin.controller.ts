import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('doctors/pending')
  async getPendingDoctors() {
    return this.adminService.getPendingDoctors();
  }

  @Post('doctors/:id/approve')
  @HttpCode(HttpStatus.OK)
  async approveDoctor(
    @Param('id') doctorId: string,
    @CurrentUser('id') adminUserId: string,
  ) {
    return this.adminService.approveDoctor(doctorId, adminUserId);
  }

  @Get('triage-logs')
  async getTriageLogs() {
    return this.adminService.getTriageLogs();
  }

  @Get('queue/alerts')
  async getQueueAlerts() {
    return this.adminService.getQueueAlerts();
  }
}
