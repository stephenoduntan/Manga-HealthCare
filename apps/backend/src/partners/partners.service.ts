import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class PartnersService {
  private readonly logger = new Logger(PartnersService.name);
  private memoryFulfilled = new Map<string, { fulfilled_at: Date; partner_id: string }>();

  constructor(private prisma: PrismaService) {}

  /**
   * Verified Pharmacy/Lab/Referral Partner lookup by Patient Public ID (PAT-XXXX)
   */
  async lookupPatientRecords(patientPublicId: string, partnerUserId: string) {
    const normalizedPublicId = patientPublicId.trim().toUpperCase();

    let patient: any = null;

    if (this.prisma.isConnected) {
      try {
        patient = await this.prisma.user.findUnique({
          where: { public_id: normalizedPublicId },
          include: {
            patient_profile: true,
            patient_bookings: {
              include: {
                consultation: {
                  include: {
                    prescriptions: true,
                  },
                },
                doctor: {
                  include: { doctor_profile: true },
                },
              },
              orderBy: { created_at: 'desc' },
            },
          },
        });
      } catch (err: any) {
        this.logger.warn(`Prisma partner lookup error: ${err?.message}`);
      }
    }

    if (!patient) {
      throw new NotFoundException(
        `Patient with ID ${normalizedPublicId} not found or no records available.`,
      );
    }

    if (!patient.ndpr_consent) {
      throw new ForbiddenException(
        `Patient ${normalizedPublicId} has not granted active NDPR record-sharing consent.`,
      );
    }

    // Explicit NDPR Audit Log entry for partner lookup
    if (this.prisma.isConnected) {
      try {
        await this.prisma.auditLog.create({
          data: {
            user_id: partnerUserId || patient.id,
            action: 'PRESCRIPTION_LOOKUP_PARTNER',
            target_record: `PATIENT_PUBLIC_ID:${normalizedPublicId}`,
            timestamp: new Date(),
          },
        });
      } catch (err: any) {
        this.logger.warn(`Failed to create partner lookup audit log: ${err?.message}`);
      }
    }

    this.logger.log(
      `[PARTNER LOOKUP] Partner ${partnerUserId} queried medical records for patient ${normalizedPublicId}`,
    );

    // Extract prescriptions, lab requests, and referrals
    const prescriptions: any[] = [];
    const labRequests: any[] = [];
    const referrals: any[] = [];

    const bookings = patient.patient_bookings || [];
    for (const b of bookings) {
      const consultation = b.consultation;
      if (!consultation) continue;

      if (consultation.prescriptions && consultation.prescriptions.length > 0) {
        for (const rx of consultation.prescriptions) {
          prescriptions.push({
            prescription_id: rx.id,
            consultation_id: consultation.id,
            date_prescribed: rx.created_at,
            prescribing_doctor: {
              name: b.doctor?.name || 'Dr. Practitioner',
              public_id: b.doctor?.public_id || 'DOC-XXXX',
              mdcn_license: b.doctor?.doctor_profile?.mdcn_license_number || 'MDCN-VERIFIED',
            },
            items: rx.items,
            download_pdf_url: rx.generated_pdf_url,
            is_fulfilled: rx.is_fulfilled ?? this.memoryFulfilled.has(rx.id),
            fulfilled_at: rx.fulfilled_at ?? null,
          });
        }
      }

      if (consultation.lab_requests) {
        labRequests.push({
          consultation_id: consultation.id,
          date: consultation.created_at,
          requests: consultation.lab_requests,
        });
      }

      if (consultation.referral_note) {
        referrals.push({
          consultation_id: consultation.id,
          date: consultation.created_at,
          referral_note: consultation.referral_note,
        });
      }
    }

    return {
      success: true,
      patient_summary: {
        public_id: patient.public_id,
        name: patient.name,
        phone: patient.phone,
        preferred_languages: patient.patient_profile?.preferred_languages || ['English'],
        allergies: patient.patient_profile?.allergies || [],
      },
      active_prescriptions: prescriptions,
      lab_requests: labRequests,
      referrals: referrals,
      ndpr_audit: {
        logged_at: new Date().toISOString(),
        compliance_notice:
          'Access to this record is logged and monitored in compliance with the Nigeria Data Protection Regulation (NDPR). Unauthorized dissemination is strictly prohibited.',
      },
    };
  }

  /**
   * Marks an e-prescription as dispensed/fulfilled by a Partner Pharmacy to prevent duplicate dispensing
   */
  async fulfillPrescription(prescriptionId: string, partnerUserId: string) {
    const fulfilledAt = new Date();

    if (this.prisma.isConnected) {
      const existing = await this.prisma.prescription.findUnique({
        where: { id: prescriptionId },
      });
      if (!existing) {
        throw new NotFoundException(`Prescription ${prescriptionId} not found`);
      }
      if (existing.is_fulfilled) {
        throw new BadRequestException(
          `Prescription ${prescriptionId} was already fulfilled and cannot be dispensed again.`,
        );
      }

      const updated = await this.prisma.prescription.update({
        where: { id: prescriptionId },
        data: {
          is_fulfilled: true,
          fulfilled_at: fulfilledAt,
          fulfilled_by_partner_id: partnerUserId,
        },
      });

      await this.prisma.auditLog.create({
        data: {
          user_id: partnerUserId,
          action: 'PRESCRIPTION_FULFILLED_PARTNER',
          target_record: `PRESCRIPTION:${prescriptionId}`,
          timestamp: fulfilledAt,
        },
      });

      return { success: true, prescription: updated };
    }

    if (this.memoryFulfilled.has(prescriptionId)) {
      throw new BadRequestException(
        `Prescription ${prescriptionId} was already fulfilled and cannot be dispensed again.`,
      );
    }

    this.memoryFulfilled.set(prescriptionId, {
      fulfilled_at: fulfilledAt,
      partner_id: partnerUserId,
    });

    return {
      success: true,
      prescription: {
        id: prescriptionId,
        is_fulfilled: true,
        fulfilled_at: fulfilledAt,
        fulfilled_by_partner_id: partnerUserId,
      },
    };
  }
}
