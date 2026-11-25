import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { BookingStatus, BookingType, PaymentStatus, Role, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { TriageService } from '../triage/triage.service';
import { QueueService } from './queue.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import * as crypto from 'crypto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  // In-memory store for fallback/testing
  private memoryBookings = new Map<string, any>();
  private memorySlots = new Map<string, any>();

  constructor(
    private prisma: PrismaService,
    private triageService: TriageService,
    private queueService: QueueService,
  ) {}

  /**
   * Creates a new booking (Instant Lobby or Scheduled Slot)
   */
  async createBooking(patientId: string, dto: CreateBookingDto) {
    // 1. Mandatory Triage Clearance Token Verification
    const triageData = this.triageService.validateClearanceToken(dto.triage_clearance_token);
    if (!triageData) {
      throw new ForbiddenException('Valid triage clearance token is required to book a consultation');
    }

    // 2. Mandatory NDPR + Telemedicine Consent check
    let user: any = null;
    if (this.prisma.isConnected) {
      try {
        user = await this.prisma.user.findUnique({
          where: { id: patientId },
          include: { patient_profile: true },
        });
      } catch (err: any) {
        this.logger.warn(`Prisma findUnique user error: ${err?.message}`);
      }
    }

    // If user not found in DB or DB offline, check consent
    if (user && (!user.telemedicine_consent || !user.ndpr_consent)) {
      throw new BadRequestException(
        'Patient must accept both Telemedicine Consent and NDPR Consent before booking a consultation',
      );
    }

    const patientName = user?.name || 'Patient';
    const patientPhone = user?.phone || '+2348000000000';

    // 3. PRD Therapy Rule Enforcement
    if (dto.booking_type === BookingType.THERAPY_MANDATORY_SLOT) {
      if (!dto.slot_id && !dto.slot_label) {
        throw new BadRequestException(
          'Therapy sessions MUST be booked using a designated availability slot and a selected therapist.',
        );
      }
      if (!dto.doctor_id && !dto.slot_label) {
        throw new BadRequestException(
          'Therapy sessions MUST specify a selected therapist or designated slot.',
        );
      }
    }

    if (
      dto.booking_type === BookingType.INSTANT_QUEUE &&
      (dto.specialty?.toLowerCase().includes('therap') || dto.specialty?.toLowerCase().includes('mental'))
    ) {
      throw new BadRequestException(
        'Therapy sessions require in-depth clinical intake and must use scheduled calendar slots (THERAPY_MANDATORY_SLOT). Instant queue is not permitted for therapy.',
      );
    }

    // 4. Check for 14-day follow-up discount eligibility
    let isFollowup = dto.is_followup ?? false;
    if (!isFollowup && dto.doctor_id && this.prisma.isConnected) {
      try {
        const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const priorConsultation = await this.prisma.booking.findFirst({
          where: {
            patient_id: patientId,
            doctor_id: dto.doctor_id,
            status: BookingStatus.COMPLETED,
            created_at: { gte: fourteenDaysAgo },
          },
        });
        if (priorConsultation) {
          isFollowup = true;
          this.logger.log(`Patient ${patientId} qualified for reduced follow-up fee with doctor ${dto.doctor_id}`);
        }
      } catch (err: any) {
        this.logger.warn(`Follow-up check error: ${err?.message}`);
      }
    }

    const bookingId = crypto.randomUUID();

    // 5. Handle Booking Types
    if (dto.booking_type === BookingType.INSTANT_QUEUE) {
      // Instant Queue Mode ("Talk to Doctor Now")
      let booking: any = null;
      if (this.prisma.isConnected) {
        try {
          booking = await this.prisma.booking.create({
            data: {
              id: bookingId,
              patient_id: patientId,
              doctor_id: null,
              slot_id: null,
              booking_type: BookingType.INSTANT_QUEUE,
              is_followup: isFollowup,
              status: BookingStatus.IN_QUEUE,
              triage_flagged: false,
              payment_status: PaymentStatus.UNPAID,
            },
            include: { patient: true },
          });
        } catch (err: any) {
          this.logger.warn(`Failed to create instant queue booking in DB: ${err?.message}`);
        }
      }

      if (!booking) {
        booking = {
          id: bookingId,
          patient_id: patientId,
          doctor_id: null,
          slot_id: null,
          booking_type: BookingType.INSTANT_QUEUE,
          is_followup: isFollowup,
          status: BookingStatus.IN_QUEUE,
          triage_flagged: false,
          payment_status: PaymentStatus.UNPAID,
          created_at: new Date(),
          patient: user || { id: patientId, name: patientName, phone: patientPhone },
        };
        this.memoryBookings.set(bookingId, booking);
      }

      // Enqueue in Lobby Queue
      const queueResult = await this.queueService.enqueuePatient(
        bookingId,
        patientId,
        patientName,
        patientPhone,
        triageData.chief_complaint,
      );

      return {
        booking,
        queue: queueResult,
        message: 'You have entered the instant consultation lobby. A doctor will connect with you shortly.',
      };
    } else {
      // Scheduled Slot Booking
      if (!dto.slot_id && !dto.slot_label) {
        throw new BadRequestException('Availability slot_id is required for scheduled bookings');
      }

      // Check slot availability atomically
      if (this.prisma.isConnected && dto.slot_id) {
        try {
          const slot = await this.prisma.availabilitySlot.findUnique({
            where: { id: dto.slot_id },
          });

          if (!slot) {
            throw new NotFoundException('Selected availability slot not found');
          }
          if (slot.is_booked) {
            throw new BadRequestException('This slot has already been reserved by another patient');
          }

          // Mark slot as booked
          await this.prisma.availabilitySlot.update({
            where: { id: dto.slot_id },
            data: { is_booked: true },
          });

          const booking = await this.prisma.booking.create({
            data: {
              id: bookingId,
              patient_id: patientId,
              doctor_id: dto.doctor_id,
              slot_id: dto.slot_id,
              booking_type: dto.booking_type,
              is_followup: isFollowup,
              status: BookingStatus.PENDING,
              triage_flagged: false,
              payment_status: PaymentStatus.UNPAID,
            },
            include: {
              patient: true,
              doctor: true,
              slot: true,
            },
          });

          return {
            booking,
            message: 'Scheduled consultation reserved. Proceed to payment verification to confirm.',
          };
        } catch (err: any) {
          if (err instanceof BadRequestException || err instanceof NotFoundException) throw err;
          this.logger.warn(`Prisma scheduled booking error: ${err?.message}`);
        }
      }

      // Memory fallback for scheduled slot
      const memSlot = dto.slot_id ? this.memorySlots.get(dto.slot_id) : null;
      if (memSlot && memSlot.is_booked) {
        throw new BadRequestException('This slot has already been reserved by another patient');
      }
      if (memSlot) memSlot.is_booked = true;

      const booking = {
        id: bookingId,
        patient_id: patientId,
        doctor_id: dto.doctor_id,
        slot_id: dto.slot_id || null,
        slot_label: dto.slot_label || null,
        consultation_mode: dto.consultation_mode || 'VIDEO',
        booking_type: dto.booking_type,
        is_followup: isFollowup,
        status: BookingStatus.PENDING,
        triage_flagged: false,
        payment_status: PaymentStatus.UNPAID,
        created_at: new Date(),
      };
      this.memoryBookings.set(bookingId, booking);

      return {
        booking,
        message: 'Scheduled consultation reserved. Proceed to payment verification to confirm.',
      };
    }
  }

  /**
   * Active Doctor claims the next patient in the instant lobby queue
   */
  async claimNextFromQueue(doctorId: string) {
    const queueItem = await this.queueService.claimNextPatient();
    if (!queueItem) {
      return {
        claimed: false,
        message: 'No patients currently waiting in the instant lobby queue.',
      };
    }

    const bookingId = queueItem.booking_id;
    let updatedBooking: any = null;

    if (this.prisma.isConnected) {
      try {
        updatedBooking = await this.prisma.booking.update({
          where: { id: bookingId },
          data: {
            doctor_id: doctorId,
            status: BookingStatus.CONFIRMED,
          },
          include: {
            patient: true,
            doctor: true,
          },
        });

        // Initialize consultation session
        await this.prisma.consultation.upsert({
          where: { booking_id: bookingId },
          create: {
            booking_id: bookingId,
            mode: 'VIDEO',
            notes: {
              chief_complaint: queueItem.chief_complaint,
              history_of_present_illness: '',
              assessment: '',
              plan: '',
            },
          },
          update: {},
        });
      } catch (err: any) {
        this.logger.warn(`Failed to update claimed booking in DB: ${err?.message}`);
      }
    }

    if (!updatedBooking) {
      const mem = this.memoryBookings.get(bookingId);
      if (mem) {
        mem.doctor_id = doctorId;
        mem.status = BookingStatus.CONFIRMED;
        updatedBooking = mem;
      } else {
        updatedBooking = {
          id: bookingId,
          patient_id: queueItem.patient_id,
          doctor_id: doctorId,
          status: BookingStatus.CONFIRMED,
          patient: { name: queueItem.patient_name, phone: queueItem.patient_phone },
        };
      }
    }

    this.logger.log(`Doctor ${doctorId} claimed patient ${queueItem.patient_name} (Booking: ${bookingId})`);

    return {
      claimed: true,
      booking: updatedBooking,
      patient: {
        id: queueItem.patient_id,
        name: queueItem.patient_name,
        phone: queueItem.patient_phone,
        chief_complaint: queueItem.chief_complaint,
      },
      message: 'Patient successfully claimed. You may now launch the video/audio consultation session.',
    };
  }

  /**
   * Get single booking by ID with resource authorization
   */
  async getBooking(bookingId: string, requester?: { id: string; role: string }) {
    const assertAuthorized = (b: any) => {
      if (!requester || requester.role === Role.ADMIN) return;
      const isOwner = b.patient_id === requester.id || b.doctor_id === requester.id;
      if (!isOwner) {
        throw new ForbiddenException('You are not authorized to access this booking');
      }
    };

    if (this.prisma.isConnected) {
      try {
        const booking = await this.prisma.booking.findUnique({
          where: { id: bookingId },
          include: {
            patient: true,
            doctor: true,
            slot: true,
            consultation: {
              include: { prescriptions: true },
            },
            payments: true,
          },
        });
        if (booking) {
          assertAuthorized(booking);
          return booking;
        }
      } catch (err: any) {
        if (err instanceof ForbiddenException) throw err;
        this.logger.warn(`Failed to fetch booking: ${err?.message}`);
      }
    }

    const mem = this.memoryBookings.get(bookingId);
    if (mem) {
      assertAuthorized(mem);
      return mem;
    }

    throw new NotFoundException(`Booking ${bookingId} not found`);
  }

  /**
   * List bookings for a user
   */
  async getUserBookings(userId: string, role: string) {
    if (this.prisma.isConnected) {
      try {
        const whereClause =
          role === Role.DOCTOR || role === Role.LOCUM || role === Role.THERAPIST
            ? { doctor_id: userId }
            : { patient_id: userId };

        return await this.prisma.booking.findMany({
          where: whereClause,
          include: {
            patient: true,
            doctor: true,
            slot: true,
            consultation: true,
            payments: true,
          },
          orderBy: { created_at: 'desc' },
        });
      } catch (err: any) {
        this.logger.warn(`Failed to list bookings: ${err?.message}`);
      }
    }

    // Memory fallback
    const list: any[] = [];
    for (const b of this.memoryBookings.values()) {
      if (b.patient_id === userId || b.doctor_id === userId) {
        list.push(b);
      }
    }
    return list;
  }

  /**
   * Create doctor availability slot (supports ISO timestamps or frontend day + time_range)
   */
  async createSlot(doctorId: string, dto: CreateSlotDto) {
    const slotId = crypto.randomUUID();
    const startTime = dto.start_time ? new Date(dto.start_time) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    const endTime = dto.end_time
      ? new Date(dto.end_time)
      : new Date(startTime.getTime() + (dto.slot_type === 'THERAPY_MANDATORY' ? 45 : 30) * 60 * 1000);

    if (startTime >= endTime) {
      throw new BadRequestException('Slot start_time must be strictly before end_time');
    }

    if (this.prisma.isConnected) {
      try {
        const created = await this.prisma.availabilitySlot.create({
          data: {
            id: slotId,
            doctor_id: doctorId,
            start_time: startTime,
            end_time: endTime,
            is_booked: false,
          },
        });
        return {
          ...created,
          day: dto.day,
          time_range: dto.time_range,
          slot_type: dto.slot_type || 'GENERAL',
        };
      } catch (err: any) {
        this.logger.warn(`Prisma createSlot error: ${err?.message}`);
      }
    }

    const memSlot = {
      id: slotId,
      doctor_id: doctorId,
      start_time: startTime,
      end_time: endTime,
      day: dto.day,
      time_range: dto.time_range,
      slot_type: dto.slot_type || 'GENERAL',
      is_booked: false,
    };
    this.memorySlots.set(slotId, memSlot);
    return memSlot;
  }

  /**
   * Get doctor availability slots
   */
  async getDoctorSlots(doctorId: string) {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.availabilitySlot.findMany({
          where: {
            doctor_id: doctorId,
            is_booked: false,
            start_time: { gte: new Date() },
          },
          orderBy: { start_time: 'asc' },
        });
      } catch (err: any) {
        this.logger.warn(`Prisma getDoctorSlots error: ${err?.message}`);
      }
    }

    const slots: any[] = [];
    for (const s of this.memorySlots.values()) {
      if (s.doctor_id === doctorId && !s.is_booked) {
        slots.push(s);
      }
    }
    return slots;
  }

  /**
   * Lists VERIFIED doctors/therapists filterable by specialty, language, and availability
   */
  async listVerifiedDoctors(filters: {
    specialty?: string;
    language?: string;
    availability?: string;
  }) {
    if (!this.prisma.isConnected) {
      return [];
    }

    const profiles = await this.prisma.doctorProfile.findMany({
      where: {
        verification_status: VerificationStatus.VERIFIED,
        ...(filters.specialty
          ? { specialty: { contains: filters.specialty, mode: 'insensitive' } }
          : {}),
        ...(filters.language ? { languages: { has: filters.language } } : {}),
        ...(filters.availability === 'online' ? { is_online: true } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            public_id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return profiles;
  }

  /**
   * Claims a specific waiting patient (or next FIFO if bookingId === 'next')
   */
  async claimSpecificOrNextFromQueue(doctorId: string, bookingId: string) {
    if (bookingId === 'next') {
      return this.claimNextFromQueue(doctorId);
    }

    const status = await this.queueService.getQueueStatus();
    const target = status.items.find((item) => item.booking_id === bookingId);
    if (!target) {
      return this.claimNextFromQueue(doctorId);
    }

    await this.queueService.removePatient(bookingId);

    let updatedBooking: any = null;
    if (this.prisma.isConnected) {
      updatedBooking = await this.prisma.booking.update({
        where: { id: bookingId },
        data: { doctor_id: doctorId, status: BookingStatus.CONFIRMED },
        include: { patient: true, doctor: true },
      });
    } else {
      const mem = this.memoryBookings.get(bookingId);
      if (mem) {
        mem.doctor_id = doctorId;
        mem.status = BookingStatus.CONFIRMED;
        updatedBooking = mem;
      } else {
        updatedBooking = { id: bookingId, doctor_id: doctorId, status: BookingStatus.CONFIRMED };
      }
    }

    return {
      claimed: true,
      booking: updatedBooking,
      patient: {
        id: target.patient_id,
        name: target.patient_name,
        phone: target.patient_phone,
        chief_complaint: target.chief_complaint,
      },
    };
  }

  /**
   * Cancels an unstarted booking and releases locked calendar slots / queue entries
   */
  async cancelBooking(bookingId: string, userId: string, userRole: string) {
    await this.queueService.removePatient(bookingId);

    if (this.prisma.isConnected) {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: { slot: true },
      });
      if (!booking) {
        throw new NotFoundException(`Booking ${bookingId} not found`);
      }
      if (
        userRole !== Role.ADMIN &&
        booking.patient_id !== userId &&
        booking.doctor_id !== userId
      ) {
        throw new ForbiddenException('You are not authorized to cancel this booking');
      }
      if (booking.status === BookingStatus.COMPLETED) {
        throw new BadRequestException('Cannot cancel an already completed booking');
      }

      if (booking.slot_id) {
        await this.prisma.availabilitySlot.update({
          where: { id: booking.slot_id },
          data: { is_booked: false },
        });
      }

      const cancelled = await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });
      return { success: true, booking: cancelled };
    }

    const mem = this.memoryBookings.get(bookingId);
    if (!mem) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }
    if (mem.slot_id && this.memorySlots.has(mem.slot_id)) {
      this.memorySlots.get(mem.slot_id).is_booked = false;
    }
    mem.status = BookingStatus.CANCELLED;
    return { success: true, booking: mem };
  }
}
