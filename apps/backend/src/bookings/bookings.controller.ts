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
import { BookingsService } from './bookings.service';
import { QueueService } from './queue.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TriageClearanceGuard } from '../common/guards/triage-clearance.guard';
import { NdprConsentGuard } from '../common/guards/ndpr-consent.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RequireConsent } from '../common/decorators/ndpr-consent.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('api/v1/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly queueService: QueueService,
  ) {}

  @Get('doctors')
  @Roles('PATIENT', 'ADMIN')
  async listVerifiedDoctors(
    @Query('specialty') specialty?: string,
    @Query('language') language?: string,
    @Query('availability') availability?: string,
  ) {
    return this.bookingsService.listVerifiedDoctors({ specialty, language, availability });
  }

  @Public()
  @Get('doctors/:doctorId/slots')
  async getDoctorSlotsByDoctorRoute(@Param('doctorId') doctorId: string) {
    return this.bookingsService.getDoctorSlots(doctorId);
  }

  @Post()
  @Roles('PATIENT', 'ADMIN')
  @UseGuards(NdprConsentGuard, TriageClearanceGuard)
  @RequireConsent()
  @HttpCode(HttpStatus.CREATED)
  async createBooking(
    @CurrentUser('id') patientId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(patientId, dto);
  }

  @Get()
  async getUserBookings(@CurrentUser() user: AuthenticatedUser) {
    return this.bookingsService.getUserBookings(user.id, user.role);
  }

  @Public()
  @Get('queue/status')
  async getQueueStatus() {
    return this.queueService.getQueueStatus();
  }

  @Post('queue/claim')
  @Roles('DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async claimNextFromQueue(@CurrentUser('id') doctorId: string) {
    return this.bookingsService.claimNextFromQueue(doctorId);
  }

  @Post('slots')
  @Roles('DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async createSlot(
    @CurrentUser('id') doctorId: string,
    @Body() dto: CreateSlotDto,
  ) {
    return this.bookingsService.createSlot(doctorId, dto);
  }

  @Public()
  @Get('slots/doctor/:doctorId')
  async getDoctorSlots(@Param('doctorId') doctorId: string) {
    return this.bookingsService.getDoctorSlots(doctorId);
  }

  @Get(':id')
  @Roles('PATIENT', 'DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  async getBooking(@Param('id') id: string) {
    return this.bookingsService.getBooking(id);
  }

  @Patch(':id/cancel')
  @Roles('PATIENT', 'DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async cancelBooking(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bookingsService.cancelBooking(id, user.id, user.role);
  }
}
