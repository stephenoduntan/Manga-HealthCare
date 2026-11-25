import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Module,
  NotFoundException,
  Optional,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RecordsService } from '../records/records.service';
import { RecordsModule } from '../records/records.module';
import { UpdateIntakeDto } from '../records/dto/update-intake.dto';
import { NotificationsService } from '../notifications/notifications.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuditTarget } from '../common/decorators/audit-target.decorator';

@Injectable()
export class PatientsService {
  private memoryReminders = new Map<string, any[]>();
  private memoryRatings = new Map<string, { rating: number; feedback?: string }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly recordsService: RecordsService,
    @Optional() private readonly notifications?: NotificationsService,
  ) {}

  async getMyProfile(userId: string) {
    if (this.prisma.isConnected) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { patient_profile: true },
      });
      if (user) {
        return {
          id: user.id,
          public_id: user.public_id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          telemedicine_consent: user.telemedicine_consent,
          ndpr_consent: user.ndpr_consent,
          profile: user.patient_profile,
        };
      }
    }
    return this.recordsService.getPatientRecord(userId).catch(() => ({
      id: userId,
      preferred_languages: ['English'],
      allergies: [],
      existing_conditions: [],
      current_medications: [],
    }));
  }

  async updateMyIntake(userId: string, dto: UpdateIntakeDto) {
    return this.recordsService.updatePatientIntake(userId, dto);
  }

  async getDashboard(userId: string) {
    let bookings: any[] = [];
    let prescriptions: any[] = [];

    if (this.prisma.isConnected) {
      bookings = await this.prisma.booking.findMany({
        where: { patient_id: userId },
        include: {
          doctor: { include: { doctor_profile: true } },
          slot: true,
          consultation: { include: { prescriptions: true } },
        },
        orderBy: { created_at: 'desc' },
        take: 10,
      });

      for (const b of bookings) {
        if (b.consultation?.prescriptions) {
          prescriptions.push(...b.consultation.prescriptions);
        }
      }
    }

    const upcomingBookings = bookings.filter((b) =>
      ['PENDING', 'IN_QUEUE', 'CONFIRMED'].includes(b.status),
    );
    const recentConsultations = bookings
      .filter((b) => b.status === 'COMPLETED' && b.consultation)
      .slice(0, 5);

    return {
      patient_id: userId,
      upcoming_bookings: upcomingBookings,
      active_prescriptions: prescriptions,
      followup_reminders: this.memoryReminders.get(userId) || [],
      recent_consultations: recentConsultations,
    };
  }

  async getHistory(userId: string, page = 1, limit = 20) {
    const safeLimit = Math.min(Math.max(limit, 1), 50);
    const skip = (Math.max(page, 1) - 1) * safeLimit;

    if (!this.prisma.isConnected) {
      return { page, limit: safeLimit, total: 0, items: [] };
    }

    const [items, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { patient_id: userId },
        include: {
          doctor: { include: { doctor_profile: true } },
          consultation: { include: { prescriptions: true } },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: safeLimit,
      }),
      this.prisma.booking.count({ where: { patient_id: userId } }),
    ]);

    return { page, limit: safeLimit, total, items };
  }

  async scheduleReminder(
    userId: string,
    body: { title?: string; message?: string; remind_at?: string },
  ) {
    const title = body.title?.trim() || 'Follow-Up Consultation Reminder';
    const message =
      body.message?.trim() || 'Your 14-day Manga Healthcare follow-up review is due.';
    const remindAt = body.remind_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    let fcmToken: string | null = null;
    if (this.prisma.isConnected) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { fcm_token: true },
      });
      fcmToken = user?.fcm_token || null;
    }

    const entry = {
      id: `rem_${Date.now()}`,
      title,
      message,
      remind_at: remindAt,
      created_at: new Date().toISOString(),
    };
    const existing = this.memoryReminders.get(userId) || [];
    existing.unshift(entry);
    this.memoryReminders.set(userId, existing);

    await this.notifications?.scheduleFollowupReminder({
      userId,
      fcmToken,
      title,
      message,
      remindAtIso: remindAt,
    });

    return { success: true, reminder: entry };
  }

  async rateConsultation(
    patientId: string,
    consultationId: string,
    body: { rating: number; feedback?: string },
  ) {
    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be an integer between 1 and 5');
    }

    if (this.prisma.isConnected) {
      const consultation = await this.prisma.consultation.findUnique({
        where: { id: consultationId },
        include: { booking: true },
      });
      if (!consultation) {
        throw new NotFoundException(`Consultation ${consultationId} not found`);
      }
      if (consultation.booking?.patient_id && consultation.booking.patient_id !== patientId) {
        throw new BadRequestException('You can only rate your own consultation');
      }

      const updated = await this.prisma.consultation.update({
        where: { id: consultationId },
        data: { rating, feedback: body.feedback?.trim() || null },
      });
      return {
        success: true,
        consultation_id: updated.id,
        rating: updated.rating,
        feedback: updated.feedback,
      };
    }

    this.memoryRatings.set(consultationId, { rating, feedback: body.feedback });
    return {
      success: true,
      consultation_id: consultationId,
      rating,
      feedback: body.feedback || null,
    };
  }
}

@Controller('api/v1/patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PATIENT', 'ADMIN')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('me/profile')
  @AuditTarget('patient_profiles')
  async getMyProfile(@CurrentUser('id') userId: string) {
    return this.patientsService.getMyProfile(userId);
  }

  @Put('me/intake')
  @AuditTarget('patient_profiles')
  @HttpCode(HttpStatus.OK)
  async updateMyIntake(@CurrentUser('id') userId: string, @Body() dto: UpdateIntakeDto) {
    return this.patientsService.updateMyIntake(userId, dto);
  }

  @Get('me/dashboard')
  async getDashboard(@CurrentUser('id') userId: string) {
    return this.patientsService.getDashboard(userId);
  }

  @Get('me/history')
  @AuditTarget('consultations')
  async getHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.patientsService.getHistory(
      userId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Post('me/reminders')
  @HttpCode(HttpStatus.CREATED)
  async scheduleReminder(
    @CurrentUser('id') userId: string,
    @Body() body: { title?: string; message?: string; remind_at?: string },
  ) {
    return this.patientsService.scheduleReminder(userId, body);
  }

  @Post('consultations/:id/rate')
  @AuditTarget('consultations')
  @HttpCode(HttpStatus.OK)
  async rateConsultation(
    @CurrentUser('id') userId: string,
    @Param('id') consultationId: string,
    @Body() body: { rating: number; feedback?: string },
  ) {
    return this.patientsService.rateConsultation(userId, consultationId, body);
  }
}

@Module({
  imports: [RecordsModule],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
