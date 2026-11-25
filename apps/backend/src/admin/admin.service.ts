import {
  Injectable,
  NotFoundException,
  Logger,
  Optional,
} from '@nestjs/common';
import { BookingStatus, PaymentStatus, Role, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { TriageService } from '../triage/triage.service';
import { QueueService } from '../bookings/queue.service';
import { NotificationsService } from '../notifications/notifications.module';
import { generatePublicId } from '../common/utils/public-id.util';
import * as crypto from 'crypto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  // In-memory fallback
  private memoryPendingDoctors = new Map<string, any>();

  constructor(
    private prisma: PrismaService,
    private triageService: TriageService,
    private queueService: QueueService,
    @Optional() private notifications?: NotificationsService,
  ) {}

  /**
   * List doctors awaiting MDCN credential verification
   */
  async getPendingDoctors() {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.doctorProfile.findMany({
          where: { verification_status: VerificationStatus.PENDING },
          include: {
            user: {
              select: {
                id: true,
                public_id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                created_at: true,
              },
            },
          },
          orderBy: { user: { created_at: 'desc' } },
        });
      } catch (err: any) {
        this.logger.warn(`Failed to list pending doctors from DB: ${err?.message}`);
      }
    }

    return Array.from(this.memoryPendingDoctors.values()).filter(
      (d) => d.verification_status === VerificationStatus.PENDING,
    );
  }

  /**
   * Approves a doctor/locum's MDCN credentials.
   * If locum doctor, automatically generates and issues an official LOC-XXXX Public ID.
   */
  async approveDoctor(doctorProfileId: string, adminUserId: string) {
    let doctorProfile: any = null;

    if (this.prisma.isConnected) {
      try {
        doctorProfile = await this.prisma.doctorProfile.findUnique({
          where: { id: doctorProfileId },
          include: { user: true },
        });
      } catch (err: any) {
        this.logger.warn(`Prisma error fetching doctor profile: ${err?.message}`);
      }
    }

    if (!doctorProfile) {
      doctorProfile = this.memoryPendingDoctors.get(doctorProfileId);
    }

    if (!doctorProfile) {
      // Also try searching by user_id
      if (this.prisma.isConnected) {
        try {
          doctorProfile = await this.prisma.doctorProfile.findFirst({
            where: { user_id: doctorProfileId },
            include: { user: true },
          });
        } catch {
          // ignore
        }
      }
    }

    if (!doctorProfile) {
      throw new NotFoundException(`Doctor profile ${doctorProfileId} not found`);
    }

    const isLocum = doctorProfile.is_locum || doctorProfile.user?.role === Role.LOCUM;
    let newPublicId = doctorProfile.user?.public_id;

    // Issue LOC-XXXX if locum
    if (isLocum && (!newPublicId || !newPublicId.startsWith('LOC-'))) {
      const locumSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
      newPublicId = `LOC-${locumSuffix}`;
    }

    // Update in database
    if (this.prisma.isConnected) {
      try {
        await this.prisma.doctorProfile.update({
          where: { id: doctorProfile.id },
          data: { verification_status: VerificationStatus.VERIFIED },
        });

        await this.prisma.user.update({
          where: { id: doctorProfile.user_id },
          data: {
            public_id: newPublicId,
            role: isLocum ? Role.LOCUM : Role.DOCTOR,
          },
        });

        // Audit Logs
        await this.prisma.auditLog.create({
          data: {
            user_id: adminUserId || '00000000-0000-0000-0000-000000000000',
            action: 'MDCN_VERIFICATION_STATUS_UPDATED',
            target_record: `DOCTOR_PROFILE:${doctorProfile.id}:VERIFIED`,
            timestamp: new Date(),
          },
        });

        if (isLocum) {
          await this.prisma.auditLog.create({
            data: {
              user_id: adminUserId || '00000000-0000-0000-0000-000000000000',
              action: 'LOCUM_CREDENTIAL_ISSUED',
              target_record: `LOCUM_ID:${newPublicId}:USER:${doctorProfile.user_id}`,
              timestamp: new Date(),
            },
          });
        }
      } catch (err: any) {
        this.logger.warn(`Failed to approve doctor in DB: ${err?.message}`);
      }
    }

    doctorProfile.verification_status = VerificationStatus.VERIFIED;
    if (doctorProfile.user) {
      doctorProfile.user.public_id = newPublicId;
      doctorProfile.user.role = isLocum ? Role.LOCUM : Role.DOCTOR;
    }

    this.logger.log(
      `[DOCTOR APPROVED] Doctor ${doctorProfile.user?.name} verified. Role: ${isLocum ? 'LOCUM' : 'DOCTOR'} | ID: ${newPublicId}`,
    );

    return {
      success: true,
      message: isLocum
        ? `Locum doctor credentials approved. Locum ID ${newPublicId} issued.`
        : 'Doctor MDCN credentials verified successfully.',
      doctor_profile_id: doctorProfile.id,
      user_id: doctorProfile.user_id,
      public_id: newPublicId,
      verification_status: VerificationStatus.VERIFIED,
      is_locum: isLocum,
    };
  }

  /**
   * Get all emergency redirect logs
   */
  async getTriageLogs() {
    return this.triageService.getEmergencyLogs();
  }

  /**
   * Get queue surge alerts
   */
  getQueueAlerts() {
    return this.queueService.getSurgeAlerts();
  }

  /**
   * Live Ops Monitor: queue depth, wait times, active consultations, online clinicians
   */
  async getLiveOps() {
    const queue = await this.queueService.getQueueStatus();
    let activeConsultations: any[] = [];
    let onlineClinicians: any[] = [];

    if (this.prisma.isConnected) {
      [activeConsultations, onlineClinicians] = await Promise.all([
        this.prisma.consultation.findMany({
          where: { end_time: null, start_time: { not: null } },
          include: {
            booking: { include: { patient: true, doctor: true } },
          },
          take: 25,
        }),
        this.prisma.doctorProfile.findMany({
          where: { verification_status: VerificationStatus.VERIFIED, is_online: true },
          include: { user: { select: { id: true, public_id: true, name: true, role: true } } },
        }),
      ]);
    }

    return {
      waiting_queue: queue,
      active_consultations_count: activeConsultations.length,
      active_consultations: activeConsultations,
      online_clinicians_count: onlineClinicians.length,
      online_clinicians: onlineClinicians,
      surge_alerts: this.queueService.getSurgeAlerts(),
    };
  }

  /**
   * Urgent Locum Dispatch: approves clinician, generates LOC-XXXX, dispatches OTP login credentials
   */
  async dispatchUrgentLocum(
    body: {
      name: string;
      phone: string;
      email?: string;
      mdcn_license_number: string;
      specialty?: string;
    },
    adminUserId: string,
  ) {
    const locumPublicId = generatePublicId(Role.LOCUM, true);
    let userRecord: any = null;

    if (this.prisma.isConnected) {
      userRecord = await this.prisma.user.create({
        data: {
          public_id: locumPublicId,
          role: Role.LOCUM,
          name: body.name,
          phone: body.phone,
          email: body.email?.toLowerCase() || null,
          auth_id: `locum_${crypto.randomBytes(6).toString('hex')}`,
          telemedicine_consent: true,
          ndpr_consent: true,
          doctor_profile: {
            create: {
              specialty: body.specialty || 'Emergency / Locum General Practice',
              is_locum: true,
              mdcn_license_number: body.mdcn_license_number,
              medical_degree_details: 'MBBS / Emergency Locum Verified',
              verification_status: VerificationStatus.VERIFIED,
              is_online: true,
              consultation_fee: 10000,
              followup_fee: 5000,
            },
          },
        },
        include: { doctor_profile: true },
      });

      await this.prisma.auditLog.create({
        data: {
          user_id: adminUserId,
          action: 'URGENT_LOCUM_DISPATCHED',
          target_record: `LOCUM:${locumPublicId}`,
          timestamp: new Date(),
        },
      });
    }

    await this.notifications?.notifyLocumCredentials({
      name: body.name,
      phone: body.phone,
      email: body.email,
      locumId: locumPublicId,
    });

    return {
      success: true,
      locum_public_id: locumPublicId,
      user: userRecord || { name: body.name, phone: body.phone, public_id: locumPublicId, role: Role.LOCUM },
      message: `Urgent locum ${locumPublicId} dispatched and notified via SMS/Email.`,
    };
  }

  /**
   * Rejects a clinician application with an explanation
   */
  async rejectDoctor(doctorProfileId: string, adminUserId: string, reason?: string) {
    if (this.prisma.isConnected) {
      const updated = await this.prisma.doctorProfile.update({
        where: { id: doctorProfileId },
        data: {
          verification_status: VerificationStatus.REJECTED,
          rejection_reason: reason || 'MDCN credentials could not be verified.',
        },
      });

      await this.prisma.auditLog.create({
        data: {
          user_id: adminUserId,
          action: 'MDCN_VERIFICATION_REJECTED',
          target_record: `DOCTOR_PROFILE:${doctorProfileId}`,
          timestamp: new Date(),
        },
      });

      return { success: true, doctor_profile: updated };
    }

    const mem = this.memoryPendingDoctors.get(doctorProfileId);
    if (!mem) {
      throw new NotFoundException(`Doctor profile ${doctorProfileId} not found`);
    }
    mem.verification_status = VerificationStatus.REJECTED;
    mem.rejection_reason = reason || 'MDCN credentials could not be verified.';
    return { success: true, doctor_profile: mem };
  }

  async getAuditTrail(limit = 100) {
    if (!this.prisma.isConnected) {
      return [];
    }
    return this.prisma.auditLog.findMany({
      take: Math.min(Math.max(limit, 1), 500),
      orderBy: { timestamp: 'desc' },
      include: {
        user: { select: { id: true, public_id: true, name: true, role: true } },
      },
    });
  }

  async getAnalytics() {
    if (!this.prisma.isConnected) {
      return {
        completed_consultations: 0,
        followup_bookings: 0,
        gross_revenue_naira: 0,
        biweekly_doctor_payouts_naira: 0,
        platform_net_naira: 0,
        emergency_redirects_halted: (await this.triageService.getEmergencyLogs()).length,
      };
    }

    const [completedCount, followupCount, paymentAgg, emergencyCount] = await Promise.all([
      this.prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      this.prisma.booking.count({ where: { is_followup: true } }),
      this.prisma.payment.aggregate({
        _sum: { amount: true, doctor_accrued_fee: true, platform_commission: true },
        where: { status: 'SUCCESS' },
      }),
      this.prisma.emergencyRedirectLog.count(),
    ]);

    return {
      completed_consultations: completedCount,
      followup_bookings: followupCount,
      gross_revenue_naira: Number(paymentAgg._sum.amount || 0),
      biweekly_doctor_payouts_naira: Number(paymentAgg._sum.doctor_accrued_fee || 0),
      platform_net_naira: Number(paymentAgg._sum.platform_commission || 0),
      emergency_redirects_halted: emergencyCount,
    };
  }

  async resolveDispute(
    bookingId: string,
    adminUserId: string,
    body: { action: 'REFUND' | 'REASSIGN'; new_doctor_id?: string; note?: string },
  ) {
    if (!this.prisma.isConnected) {
      return { success: true, booking_id: bookingId, action: body.action, note: body.note || null };
    }

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }

    const updated =
      body.action === 'REFUND'
        ? await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.CANCELLED, payment_status: PaymentStatus.REFUNDED },
          })
        : await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
              doctor_id: body.new_doctor_id || booking.doctor_id,
              status: BookingStatus.CONFIRMED,
            },
          });

    await this.prisma.auditLog.create({
      data: {
        user_id: adminUserId,
        action: `DISPUTE_RESOLVED_${body.action}`,
        target_record: `BOOKING:${bookingId}`,
        timestamp: new Date(),
      },
    });

    return { success: true, booking: updated, note: body.note || null };
  }
}
