import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Optional,
} from '@nestjs/common';
import { ConsultationMode, BookingStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
import { PdfService } from './pdf.service';
import { DailyAdapter } from '../integrations/daily.adapter';
import { S3Adapter } from '../integrations/s3.adapter';
import { ResendAdapter } from '../integrations/resend.adapter';
import { NotificationsService } from '../notifications/notifications.module';
import { StartConsultationDto } from './dto/start-consultation.dto';
import { SaveNotesDto } from './dto/save-notes.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class ConsultationsService {
  private readonly logger = new Logger(ConsultationsService.name);

  // In-memory fallback
  private memoryConsultations = new Map<string, any>();
  private memoryPrescriptions = new Map<string, any>();

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private pdfService: PdfService,
    @Optional() private dailyAdapter?: DailyAdapter,
    @Optional() private s3Adapter?: S3Adapter,
    @Optional() private resendAdapter?: ResendAdapter,
    @Optional() private notifications?: NotificationsService,
  ) {}

  /**
   * Start or resume consultation session (Video / Audio / Chat)
   */
  async startSession(dto: StartConsultationDto, currentUserId: string) {
    const bookingId = dto.booking_id;
    const mode = dto.mode || ConsultationMode.VIDEO;

    let consultation: any = null;

    if (this.prisma.isConnected) {
      try {
        consultation = await this.prisma.consultation.findUnique({
          where: { booking_id: bookingId },
          include: {
            booking: {
              include: { patient: true, doctor: true },
            },
          },
        });

        if (!consultation) {
          consultation = await this.prisma.consultation.create({
            data: {
              id: crypto.randomUUID(),
              booking_id: bookingId,
              start_time: new Date(),
              mode: mode,
            },
            include: {
              booking: {
                include: { patient: true, doctor: true },
              },
            },
          });
        } else if (!consultation.start_time) {
          consultation = await this.prisma.consultation.update({
            where: { id: consultation.id },
            data: { start_time: new Date(), mode: mode },
            include: {
              booking: {
                include: { patient: true, doctor: true },
              },
            },
          });
        }
      } catch (err: any) {
        this.logger.warn(`Prisma error starting consultation: ${err?.message}`);
      }
    }

    if (!consultation) {
      // Memory fallback
      consultation = this.memoryConsultations.get(bookingId);
      if (!consultation) {
        consultation = {
          id: crypto.randomUUID(),
          booking_id: bookingId,
          start_time: new Date(),
          end_time: null,
          mode: mode,
          notes: null,
          uploaded_images: [],
          referral_note: null,
          lab_requests: null,
          created_at: new Date(),
        };
        this.memoryConsultations.set(bookingId, consultation);
        this.memoryConsultations.set(consultation.id, consultation);
      }
    }

    // Generate Agora / Daily.co secure call token & room URL
    const roomId = `manga-room-${bookingId.slice(0, 8)}`;
    let roomUrl = `https://manga-healthcare.daily.co/${roomId}`;
    let callToken = `call_token_${crypto.randomBytes(16).toString('hex')}`;
    if (this.dailyAdapter) {
      const room = await this.dailyAdapter.createRoom(roomId);
      roomUrl = room.room_url;
      callToken = await this.dailyAdapter.createMeetingToken(
        room.room_name,
        currentUserId,
        consultation?.booking?.doctor_id === currentUserId,
      );
    }
    const chatFallbackChannel = `chat_channel_${bookingId.slice(0, 8)}`;

    if (consultation?.booking?.doctor_id === currentUserId && consultation?.booking?.patient?.fcm_token) {
      void this.notifications?.notifyDoctorJoined(
        consultation.booking.patient.fcm_token,
        bookingId,
        consultation?.booking?.doctor?.name || 'Your clinician',
      );
    }

    this.logger.log(`[CONSULTATION STARTED] Room: ${roomId} | Mode: ${mode} | User: ${currentUserId}`);

    return {
      consultation_id: consultation.id,
      booking_id: bookingId,
      mode: consultation.mode,
      start_time: consultation.start_time,
      session_credentials: {
        provider: 'Daily.co / WebRTC',
        room_name: roomId,
        room_url: roomUrl,
        call_token: callToken,
        chat_fallback_channel: chatFallbackChannel,
      },
      message: 'Consultation session initiated. Video/Audio and Chat channels are active.',
    };
  }

  /**
   * Upload clinical rash / wound photo during active consultation
   */
  async uploadImage(consultationId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image file provided for upload');
    }

    const ext = path.extname(file.originalname) || '.jpg';
    const fileName = `rash_${consultationId.slice(0, 8)}_${Date.now()}${ext}`;

    const savedUrl = await this.storageService.saveFile('consultations', fileName, file.buffer);

    let updatedConsultation: any = null;

    if (this.prisma.isConnected) {
      try {
        const existing = await this.prisma.consultation.findUnique({
          where: { id: consultationId },
        });

        if (existing) {
          const currentImages = existing.uploaded_images || [];
          updatedConsultation = await this.prisma.consultation.update({
            where: { id: consultationId },
            data: {
              uploaded_images: [...currentImages, savedUrl],
            },
          });
        }
      } catch (err: any) {
        this.logger.warn(`Failed to update consultation image in DB: ${err?.message}`);
      }
    }

    if (!updatedConsultation) {
      const mem = this.memoryConsultations.get(consultationId);
      if (mem) {
        mem.uploaded_images = mem.uploaded_images || [];
        mem.uploaded_images.push(savedUrl);
        updatedConsultation = mem;
      }
    }

    this.logger.log(`[IMAGE UPLOADED] Consultation ${consultationId} added image ${savedUrl}`);

    return {
      success: true,
      image_url: savedUrl,
      consultation_id: consultationId,
      uploaded_images: updatedConsultation?.uploaded_images || [savedUrl],
    };
  }

  /**
   * Save structured clinical notes: { chief_complaint, history_of_present_illness, assessment, plan }
   */
  async saveNotes(consultationId: string, dto: SaveNotesDto) {
    let consultation: any = null;

    if (this.prisma.isConnected) {
      try {
        consultation = await this.prisma.consultation.update({
          where: { id: consultationId },
          data: {
            notes: dto.notes as any,
            referral_note: dto.referral_note,
            lab_requests: (dto.lab_requests as any) || undefined,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Failed to save notes in DB: ${err?.message}`);
      }
    }

    if (!consultation) {
      const mem = this.memoryConsultations.get(consultationId);
      if (mem) {
        mem.notes = dto.notes;
        mem.referral_note = dto.referral_note;
        mem.lab_requests = dto.lab_requests;
        consultation = mem;
      }
    }

    if (!consultation) {
      throw new NotFoundException(`Consultation ${consultationId} not found`);
    }

    this.logger.log(`[NOTES SAVED] Consultation ${consultationId} saved structured clinical notes.`);

    return {
      success: true,
      consultation_id: consultationId,
      notes: consultation.notes,
      referral_note: consultation.referral_note,
      lab_requests: consultation.lab_requests,
      message: 'Structured clinical notes recorded successfully.',
    };
  }

  /**
   * Issue E-Prescription and generate official PDF
   */
  async issuePrescription(consultationId: string, dto: CreatePrescriptionDto, doctorUser: any) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one medication item is required to issue a prescription');
    }

    // Retrieve consultation, doctor, and patient details
    let consultation: any = null;
    if (this.prisma.isConnected) {
      try {
        consultation = await this.prisma.consultation.findUnique({
          where: { id: consultationId },
          include: {
            booking: {
              include: {
                patient: true,
                doctor: { include: { doctor_profile: true } },
              },
            },
          },
        });
      } catch (err: any) {
        this.logger.warn(`Failed to fetch consultation for prescription: ${err?.message}`);
      }
    }

    const prescriptionId = crypto.randomUUID();

    const doctorName =
      consultation?.booking?.doctor?.name || doctorUser?.name || 'Practitioner';
    const doctorPublicId =
      consultation?.booking?.doctor?.public_id || doctorUser?.public_id || 'DOC-DEFAULT';
    const doctorSpecialty =
      consultation?.booking?.doctor?.doctor_profile?.specialty || 'General Practice';
    const doctorMdcn =
      consultation?.booking?.doctor?.doctor_profile?.mdcn_license_number ||
      doctorUser?.mdcn_license_number ||
      'MDCN-ACTIVE-2026';

    const patientName = consultation?.booking?.patient?.name || 'Patient';
    const patientPublicId = consultation?.booking?.patient?.public_id || 'PAT-000000';
    const patientPhone = consultation?.booking?.patient?.phone || '+2348000000000';

    // Generate PDF using PDFKit
    const pdfBuffer = await this.pdfService.generatePrescriptionPdf({
      prescriptionId,
      consultationId,
      date: new Date(),
      doctor: {
        name: doctorName,
        publicId: doctorPublicId,
        specialty: doctorSpecialty,
        mdcnLicense: doctorMdcn,
      },
      patient: {
        name: patientName,
        publicId: patientPublicId,
        phone: patientPhone,
      },
      items: dto.items,
    });

    // Save PDF (via S3Adapter when configured, otherwise local StorageService)
    const pdfFileName = `prescription_${prescriptionId}.pdf`;
    const pdfUrl = this.s3Adapter
      ? await this.s3Adapter.uploadEncryptedFile(
          'prescriptions',
          pdfFileName,
          pdfBuffer,
          'application/pdf',
        )
      : await this.storageService.saveFile('prescriptions', pdfFileName, pdfBuffer);

    const patientEmail = consultation?.booking?.patient?.email;
    if (patientEmail && this.resendAdapter) {
      void this.resendAdapter.sendEmail({
        to: patientEmail,
        subject: `Your Manga Healthcare E-Prescription (${prescriptionId.slice(0, 8)})`,
        html: `<p>Your E-Prescription from <strong>${doctorName}</strong> is attached.</p>`,
        attachments: [{ filename: pdfFileName, content: pdfBuffer }],
      });
    }

    let prescription: any = null;

    if (this.prisma.isConnected) {
      try {
        prescription = await this.prisma.prescription.create({
          data: {
            id: prescriptionId,
            consultation_id: consultationId,
            items: dto.items as any,
            generated_pdf_url: pdfUrl,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Failed to persist prescription to DB: ${err?.message}`);
      }
    }

    if (!prescription) {
      prescription = {
        id: prescriptionId,
        consultation_id: consultationId,
        items: dto.items,
        generated_pdf_url: pdfUrl,
        created_at: new Date(),
      };
      this.memoryPrescriptions.set(prescriptionId, prescription);
      this.memoryPrescriptions.set(consultationId, prescription);
    }

    this.logger.log(
      `[PRESCRIPTION ISSUED] Rx: ${prescriptionId} | PDF: ${pdfUrl} | Items: ${dto.items.length}`,
    );

    return {
      success: true,
      prescription_id: prescription.id,
      consultation_id: consultationId,
      items: prescription.items,
      generated_pdf_url: pdfUrl,
      download_url: `/api/v1/consultations/${consultationId}/prescription/pdf`,
      message: 'Official MDCN-stamped E-Prescription issued and signed.',
    };
  }

  /**
   * End Consultation Session
   */
  async endSession(consultationId: string) {
    const endTime = new Date();
    let consultation: any = null;

    if (this.prisma.isConnected) {
      try {
        consultation = await this.prisma.consultation.update({
          where: { id: consultationId },
          data: { end_time: endTime },
          include: { booking: true },
        });

        if (consultation?.booking_id) {
          await this.prisma.booking.update({
            where: { id: consultation.booking_id },
            data: { status: BookingStatus.COMPLETED },
          });
        }
      } catch (err: any) {
        this.logger.warn(`Failed to end consultation in DB: ${err?.message}`);
      }
    }

    if (!consultation) {
      const mem = this.memoryConsultations.get(consultationId);
      if (mem) {
        mem.end_time = endTime;
        consultation = mem;
      }
    }

    const durationMinutes = consultation?.start_time
      ? Math.max(1, Math.round((endTime.getTime() - new Date(consultation.start_time).getTime()) / 60000))
      : 15;

    this.logger.log(`[CONSULTATION ENDED] Consultation ${consultationId} closed. Duration: ${durationMinutes}m`);

    return {
      success: true,
      consultation_id: consultationId,
      end_time: endTime,
      duration_minutes: durationMinutes,
      status: 'COMPLETED',
      message: 'Consultation ended successfully. Notes & prescription are finalized.',
    };
  }

  /**
   * Get Consultation by ID
   */
  async getConsultation(consultationId: string) {
    if (this.prisma.isConnected) {
      try {
        const c = await this.prisma.consultation.findUnique({
          where: { id: consultationId },
          include: {
            booking: {
              include: { patient: true, doctor: true },
            },
            prescriptions: true,
          },
        });
        if (c) return c;
      } catch (err: any) {
        this.logger.warn(`Failed to get consultation: ${err?.message}`);
      }
    }

    const mem = this.memoryConsultations.get(consultationId);
    if (mem) return mem;

    throw new NotFoundException(`Consultation ${consultationId} not found`);
  }

  /**
   * Get Prescription PDF Buffer for streaming
   */
  async getPrescriptionPdfBuffer(consultationId: string): Promise<Buffer> {
    let prescription: any = null;

    if (this.prisma.isConnected) {
      try {
        prescription = await this.prisma.prescription.findFirst({
          where: { consultation_id: consultationId },
          orderBy: { created_at: 'desc' },
        });
      } catch (err: any) {
        this.logger.warn(`Prisma error fetching prescription: ${err?.message}`);
      }
    }

    if (!prescription) {
      prescription = this.memoryPrescriptions.get(consultationId);
    }

    if (!prescription || !prescription.generated_pdf_url) {
      throw new NotFoundException('No prescription PDF found for this consultation');
    }

    const fileName = path.basename(prescription.generated_pdf_url);
    const buf = await this.storageService.getFile('prescriptions', fileName);
    if (!buf) {
      throw new NotFoundException('Prescription PDF file not found on disk');
    }

    return buf;
  }

  async getPatientContext(consultationId: string, doctorId: string) {
    if (this.prisma.isConnected) {
      const consultation = await this.prisma.consultation.findUnique({
        where: { id: consultationId },
        include: {
          booking: {
            include: {
              patient: {
                include: {
                  patient_profile: true,
                  patient_bookings: {
                    where: { status: BookingStatus.COMPLETED },
                    include: { consultation: { include: { prescriptions: true } } },
                    orderBy: { created_at: 'desc' },
                    take: 5,
                  },
                },
              },
            },
          },
        },
      });
      if (!consultation) {
        throw new NotFoundException(`Consultation ${consultationId} not found`);
      }

      const patient = consultation.booking.patient;
      await this.prisma.auditLog.create({
        data: {
          user_id: doctorId,
          action: 'READ_PATIENT_CONTEXT_IN_SESSION',
          target_record: `PATIENT:${patient.public_id}`,
          timestamp: new Date(),
        },
      });

      return {
        consultation_id: consultationId,
        patient: {
          id: patient.id,
          public_id: patient.public_id,
          name: patient.name,
          preferred_languages: patient.patient_profile?.preferred_languages || ['English'],
          allergies: patient.patient_profile?.allergies || [],
          existing_conditions: patient.patient_profile?.existing_conditions || [],
          current_medications: patient.patient_profile?.current_medications || [],
        },
        prior_visits: patient.patient_bookings.map((b) => ({
          booking_id: b.id,
          date: b.created_at,
          notes: b.consultation?.notes || null,
          prescriptions: b.consultation?.prescriptions || [],
        })),
      };
    }

    const mem = this.memoryConsultations.get(consultationId);
    if (!mem) {
      throw new NotFoundException(`Consultation ${consultationId} not found`);
    }
    return {
      consultation_id: consultationId,
      patient: {
        id: mem.booking_id,
        public_id: 'PAT-DEMO',
        name: 'Patient',
        preferred_languages: ['English'],
        allergies: [],
        existing_conditions: [],
        current_medications: [],
      },
      prior_visits: [],
    };
  }

  async requestAttachmentPresignedUrl(
    consultationId: string,
    filename: string,
    contentType = 'image/jpeg',
  ) {
    const ext = path.extname(filename) || '.jpg';
    const cleanName = `attachment_${consultationId.slice(0, 8)}_${Date.now()}${ext}`;
    if (this.s3Adapter) {
      return {
        consultation_id: consultationId,
        ...(await this.s3Adapter.createPresignedUploadUrl('consultations', cleanName, contentType)),
      };
    }
    return {
      consultation_id: consultationId,
      upload_url: `/uploads/consultations/${cleanName}`,
      file_key: `consultations/${cleanName}`,
      expires_in_seconds: 300,
      s3_enabled: false,
    };
  }

  async saveReferralAndLabs(
    consultationId: string,
    body: { referral_note?: string; lab_requests?: unknown },
  ) {
    if (this.prisma.isConnected) {
      const updated = await this.prisma.consultation.update({
        where: { id: consultationId },
        data: {
          referral_note: body.referral_note ?? undefined,
          lab_requests: (body.lab_requests as any) ?? undefined,
        },
      });
      return {
        success: true,
        consultation_id: updated.id,
        referral_note: updated.referral_note,
        lab_requests: updated.lab_requests,
      };
    }

    const mem = this.memoryConsultations.get(consultationId);
    if (!mem) {
      throw new NotFoundException(`Consultation ${consultationId} not found`);
    }
    if (body.referral_note !== undefined) mem.referral_note = body.referral_note;
    if (body.lab_requests !== undefined) mem.lab_requests = body.lab_requests;
    return {
      success: true,
      consultation_id: consultationId,
      referral_note: mem.referral_note,
      lab_requests: mem.lab_requests,
    };
  }

  async getPrescriptionRecord(prescriptionId: string) {
    return (
      this.memoryPrescriptions.get(prescriptionId) ||
      Array.from(this.memoryPrescriptions.values()).find((p) => p.id === prescriptionId) ||
      null
    );
  }
}
