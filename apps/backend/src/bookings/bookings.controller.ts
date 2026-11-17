import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { QueueService } from './queue.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('api/v1/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly queueService: QueueService,
  ) {}

  @Post()
  @Roles('PATIENT', 'ADMIN')
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
  async getBooking(@Param('id') id: string) {
    return this.bookingsService.getBooking(id);
  }
}
