import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Role, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { TriageService } from '../triage/triage.service';
import { QueueService } from '../bookings/queue.service';
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
}
