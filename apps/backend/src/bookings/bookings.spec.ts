import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { BookingsService } from './bookings.service';
import { QueueService } from './queue.service';
import { TriageService } from '../triage/triage.service';
import { RedisService } from '../common/redis/redis.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { BookingType } from '@prisma/client';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

describe('BookingsService & QueueService (Instant Lobby & Therapy Rules)', () => {
  let bookingsService: BookingsService;
  let queueService: QueueService;
  let triageService: TriageService;
  let redisService: RedisService;
  let validClearanceToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
          secret: 'test-booking-jwt-secret-2026',
          signOptions: { expiresIn: '30m' },
        }),
      ],
      providers: [
        BookingsService,
        QueueService,
        TriageService,
        RedisService,
        {
          provide: PrismaService,
          useValue: {
            isConnected: false,
          },
        },
      ],
    }).compile();

    bookingsService = module.get<BookingsService>(BookingsService);
    queueService = module.get<QueueService>(QueueService);
    triageService = module.get<TriageService>(TriageService);
    redisService = module.get<RedisService>(RedisService);

    await redisService.onModuleInit();

    // Generate a valid clearance token
    const triageRes = await triageService.evaluate({
      patient_id: 'patient-uuid-101',
      selected_red_flags: [],
      chief_complaint: 'Non-emergency rash and headache',
    });
    validClearanceToken = triageRes.triage_clearance_token!;
  });

  it('should block booking creation if triage clearance token is missing or invalid', async () => {
    await expect(
      bookingsService.createBooking('patient-uuid-101', {
        triage_clearance_token: 'invalid-or-fake-token',
        booking_type: BookingType.INSTANT_QUEUE,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should push patient into Instant Lobby Queue ("Talk to Doctor Now") and calculate wait time', async () => {
    const res: any = await bookingsService.createBooking('patient-uuid-101', {
      triage_clearance_token: validClearanceToken,
      booking_type: BookingType.INSTANT_QUEUE,
    });

    expect(res.booking).toBeDefined();
    expect(res.queue).toBeDefined();
    expect(res.queue.queue_position).toBeGreaterThanOrEqual(1);
    expect(res.queue.estimated_wait_minutes).toBe(res.queue.queue_position * 4);
  });

  it('should trigger LOCUM_SURGE_ALERT when queue wait exceeds 7 minutes or queue spikes (>3)', async () => {
    // Add multiple patients into queue to simulate surge
    for (let i = 1; i <= 4; i++) {
      const triage = await triageService.evaluate({
        patient_id: `patient-surge-${i}`,
        selected_red_flags: [],
        chief_complaint: `General malaise ${i}`,
      });
      await bookingsService.createBooking(`patient-surge-${i}`, {
        triage_clearance_token: triage.triage_clearance_token!,
        booking_type: BookingType.INSTANT_QUEUE,
      });
    }

    const queueStatus = await queueService.getQueueStatus();
    expect(queueStatus.queue_length).toBeGreaterThanOrEqual(4);
    expect(queueStatus.estimated_wait_minutes).toBeGreaterThan(7);
    expect(queueStatus.is_surge).toBe(true);

    const alerts = queueService.getSurgeAlerts();
    expect(alerts.active_surge).toBeDefined();
    expect(alerts.active_surge?.message).toContain('LOCUM_SURGE_ALERT');
  });

  it('should allow an active doctor to claim the next patient from queue', async () => {
    // First ensure a patient is in the queue
    await bookingsService.createBooking('patient-to-claim', {
      triage_clearance_token: validClearanceToken,
      booking_type: BookingType.INSTANT_QUEUE,
    });

    const claimRes = await bookingsService.claimNextFromQueue('doctor-uuid-999');
    expect(claimRes.claimed).toBe(true);
    expect(claimRes.booking).toBeDefined();
    expect(claimRes.booking.doctor_id).toBe('doctor-uuid-999');
  });

  it('PRD Therapy Rule: should reject instant queue for therapy sessions and enforce scheduled slots', async () => {
    // Attempting INSTANT_QUEUE for therapy
    await expect(
      bookingsService.createBooking('patient-uuid-therapy', {
        triage_clearance_token: validClearanceToken,
        booking_type: BookingType.INSTANT_QUEUE,
        specialty: 'Mental Health & Therapy',
      }),
    ).rejects.toThrow(BadRequestException);

    // Attempting THERAPY_MANDATORY_SLOT without slot_id
    await expect(
      bookingsService.createBooking('patient-uuid-therapy', {
        triage_clearance_token: validClearanceToken,
        booking_type: BookingType.THERAPY_MANDATORY_SLOT,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
