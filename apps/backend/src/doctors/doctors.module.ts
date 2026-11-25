import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Module,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { BookingsModule } from '../bookings/bookings.module';
import { BookingsService } from '../bookings/bookings.service';
import { QueueService } from '../bookings/queue.service';
import { CreateSlotDto } from '../bookings/dto/create-slot.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { MdcnVerifiedGuard } from '../common/guards/mdcn-verified.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RequireMdcnVerified } from '../common/decorators/mdcn-verified.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class DoctorsService {
  private memoryOnboarding = new Map<string, any>();
  private memoryLiveStatus = new Map<string, boolean>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly bookingsService: BookingsService,
    private readonly queueService: QueueService,
  ) {}

  async submitOnboarding(
    userId: string,
    body: {
      mdcn_license_number: string;
      medical_degree_details: string;
      specialty: string;
      bio?: string;
      languages?: string[];
      consultation_fee?: number;
      followup_fee?: number;
      is_locum?: boolean;
    },
  ) {
    if (!body.mdcn_license_number || !body.medical_degree_details || !body.specialty) {
      throw new BadRequestException(
        'mdcn_license_number, medical_degree_details, and specialty are required',
      );
    }

    if (this.prisma.isConnected) {
      const profile = await this.prisma.doctorProfile.upsert({
        where: { user_id: userId },
        create: {
          user_id: userId,
          mdcn_license_number: body.mdcn_license_number.trim(),
          medical_degree_details: body.medical_degree_details.trim(),
          specialty: body.specialty.trim(),
          bio: body.bio?.trim() || null,
          languages: body.languages?.length ? body.languages : ['English'],
          consultation_fee: body.consultation_fee ?? 10000,
          followup_fee: body.followup_fee ?? 5000,
          is_locum: Boolean(body.is_locum),
          verification_status: VerificationStatus.PENDING,
        },
        update: {
          mdcn_license_number: body.mdcn_license_number.trim(),
          medical_degree_details: body.medical_degree_details.trim(),
          specialty: body.specialty.trim(),
          bio: body.bio?.trim() || null,
          languages: body.languages?.length ? body.languages : ['English'],
          consultation_fee: body.consultation_fee ?? 10000,
          followup_fee: body.followup_fee ?? 5000,
          is_locum: body.is_locum ?? undefined,
          verification_status: VerificationStatus.PENDING,
          rejection_reason: null,
        },
      });
      return {
        success: true,
        profile,
        message: 'Onboarding credentials submitted and queued for Admin MDCN verification.',
      };
    }

    const record = {
      user_id: userId,
      ...body,
      verification_status: VerificationStatus.PENDING,
      updated_at: new Date().toISOString(),
    };
    this.memoryOnboarding.set(userId, record);
    return {
      success: true,
      profile: record,
      message: 'Onboarding credentials submitted and queued for Admin MDCN verification.',
    };
  }

  async createSlot(doctorId: string, dto: CreateSlotDto) {
    return this.bookingsService.createSlot(doctorId, dto);
  }

  async deleteSlot(doctorId: string, userRole: string, slotId: string) {
    if (!this.prisma.isConnected) {
      return { success: true, deleted_slot_id: slotId };
    }

    const slot = await this.prisma.availabilitySlot.findUnique({ where: { id: slotId } });
    if (!slot) {
      throw new NotFoundException(`Availability slot ${slotId} not found`);
    }
    if (slot.doctor_id !== doctorId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own availability slots');
    }
    if (slot.is_booked) {
      throw new BadRequestException('Cannot delete a slot that has already been booked');
    }

    await this.prisma.availabilitySlot.delete({ where: { id: slotId } });
    return { success: true, deleted_slot_id: slotId };
  }

  async setLiveStatus(doctorId: string, isOnline: boolean) {
    this.memoryLiveStatus.set(doctorId, isOnline);

    if (this.prisma.isConnected) {
      try {
        await this.prisma.doctorProfile.update({
          where: { user_id: doctorId },
          data: { is_online: isOnline },
        });
      } catch {
        // Fallback when profile hasn't been created yet
      }
    }

    return {
      success: true,
      doctor_id: doctorId,
      is_online: isOnline,
      status: isOnline ? 'ONLINE_FOR_INSTANT_LOBBY' : 'OFFLINE',
    };
  }

  async getWaitingQueue() {
    return this.queueService.getQueueStatus();
  }

  async claimQueueBooking(doctorId: string, bookingId: string) {
    return this.bookingsService.claimSpecificOrNextFromQueue(doctorId, bookingId);
  }
}

@Controller('api/v1/doctors')
@UseGuards(JwtAuthGuard, RolesGuard, MdcnVerifiedGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post('onboarding')
  @Roles('DOCTOR', 'THERAPIST', 'LOCUM', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async submitOnboarding(
    @CurrentUser('id') userId: string,
    @Body()
    body: {
      mdcn_license_number: string;
      medical_degree_details: string;
      specialty: string;
      bio?: string;
      languages?: string[];
      consultation_fee?: number;
      followup_fee?: number;
      is_locum?: boolean;
    },
  ) {
    return this.doctorsService.submitOnboarding(userId, body);
  }

  @Post('slots')
  @Roles('DOCTOR', 'THERAPIST', 'ADMIN')
  @RequireMdcnVerified()
  @HttpCode(HttpStatus.CREATED)
  async createSlot(@CurrentUser('id') doctorId: string, @Body() dto: CreateSlotDto) {
    return this.doctorsService.createSlot(doctorId, dto);
  }

  @Delete('slots/:slotId')
  @Roles('DOCTOR', 'THERAPIST', 'ADMIN')
  async deleteSlot(
    @CurrentUser('id') doctorId: string,
    @CurrentUser('role') userRole: string,
    @Param('slotId') slotId: string,
  ) {
    return this.doctorsService.deleteSlot(doctorId, userRole, slotId);
  }

  @Patch('availability/live-status')
  @Roles('DOCTOR', 'LOCUM', 'ADMIN')
  @RequireMdcnVerified()
  async toggleLiveStatus(
    @CurrentUser('id') doctorId: string,
    @Body() body: { is_online: boolean },
  ) {
    return this.doctorsService.setLiveStatus(doctorId, Boolean(body?.is_online));
  }

  @Get('queue')
  @Roles('DOCTOR', 'LOCUM', 'ADMIN')
  @RequireMdcnVerified()
  async getQueue() {
    return this.doctorsService.getWaitingQueue();
  }

  @Post('queue/:bookingId/claim')
  @Roles('DOCTOR', 'LOCUM', 'ADMIN')
  @RequireMdcnVerified()
  @HttpCode(HttpStatus.OK)
  async claimQueuePatient(
    @CurrentUser('id') doctorId: string,
    @Param('bookingId') bookingId: string,
  ) {
    return this.doctorsService.claimQueueBooking(doctorId, bookingId);
  }
}

@Module({
  imports: [BookingsModule],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
