import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
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

  @Get('live-ops')
  async getLiveOps() {
    return this.adminService.getLiveOps();
  }

  @Post('locums/dispatch')
  @HttpCode(HttpStatus.CREATED)
  async dispatchLocum(
    @CurrentUser('id') adminUserId: string,
    @Body()
    body: {
      name: string;
      phone: string;
      email?: string;
      mdcn_license_number: string;
      specialty?: string;
    },
  ) {
    return this.adminService.dispatchUrgentLocum(body, adminUserId);
  }

  @Get('verifications/pending')
  async getPendingVerifications() {
    return this.adminService.getPendingDoctors();
  }

  @Get('doctors/pending')
  async getPendingDoctors() {
    return this.adminService.getPendingDoctors();
  }

  @Patch('verifications/:doctorId')
  async verifyOrRejectDoctor(
    @Param('doctorId') doctorId: string,
    @CurrentUser('id') adminUserId: string,
    @Body() body: { status: 'VERIFIED' | 'REJECTED'; reason?: string },
  ) {
    if (body?.status === 'REJECTED') {
      return this.adminService.rejectDoctor(doctorId, adminUserId, body.reason);
    }
    return this.adminService.approveDoctor(doctorId, adminUserId);
  }

  @Post('doctors/:id/approve')
  @HttpCode(HttpStatus.OK)
  async approveDoctor(
    @Param('id') doctorId: string,
    @CurrentUser('id') adminUserId: string,
  ) {
    return this.adminService.approveDoctor(doctorId, adminUserId);
  }

  @Get('compliance/emergency-redirects')
  async getComplianceEmergencyRedirects() {
    return this.adminService.getTriageLogs();
  }

  @Get('triage-logs')
  async getTriageLogs() {
    return this.adminService.getTriageLogs();
  }

  @Get('compliance/audit-trail')
  async getAuditTrail(@Query('limit') limit?: string) {
    return this.adminService.getAuditTrail(limit ? Number(limit) : 100);
  }

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Post('disputes/:bookingId/resolve')
  @HttpCode(HttpStatus.OK)
  async resolveDispute(
    @Param('bookingId') bookingId: string,
    @CurrentUser('id') adminUserId: string,
    @Body() body: { action: 'REFUND' | 'REASSIGN'; new_doctor_id?: string; note?: string },
  ) {
    return this.adminService.resolveDispute(bookingId, adminUserId, body);
  }

  @Get('queue/alerts')
  async getQueueAlerts() {
    return this.adminService.getQueueAlerts();
  }
}
