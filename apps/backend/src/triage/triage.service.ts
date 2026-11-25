import { Injectable, Logger, ForbiddenException, Optional } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { evaluateTriage, TriageEvaluationInput, RedFlagCode } from '@manga/api-contract';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';
import { NotificationsService } from '../notifications/notifications.module';
import { EvaluateTriageDto } from './dto/evaluate-triage.dto';
import * as crypto from 'crypto';

export interface EmergencyFacility {
  name: string;
  state: string;
  city: string;
  address: string;
  emergency_phone: string;
}

export const NIGERIA_EMERGENCY_FACILITIES: EmergencyFacility[] = [
  {
    name: 'Lagos State University Teaching Hospital (LASUTH)',
    state: 'Lagos',
    city: 'Ikeja',
    address: '1-5 Oba Akinjobi Way, GRA Ikeja, Lagos',
    emergency_phone: '+234 1 271 9081',
  },
  {
    name: 'Lagos University Teaching Hospital (LUTH)',
    state: 'Lagos',
    city: 'Surulere',
    address: 'Ishaga Road, Idi-Araba, Surulere, Lagos',
    emergency_phone: '+234 802 312 9000',
  },
  {
    name: 'Federal Medical Centre (FMC) Ebute-Metta',
    state: 'Lagos',
    city: 'Ebute-Metta',
    address: 'Murtala Muhammed Way, Railway Compound, Ebute Metta, Lagos',
    emergency_phone: '+234 809 394 6393',
  },
  {
    name: 'National Hospital Abuja',
    state: 'FCT',
    city: 'Abuja',
    address: 'Plot 132 Central District, Phase II, Garki, Abuja',
    emergency_phone: '+234 9 234 4022',
  },
  {
    name: 'Garki Hospital Abuja',
    state: 'FCT',
    city: 'Abuja',
    address: 'Area 8, Tafawa Balewa Way, Garki, Abuja',
    emergency_phone: '+234 9 291 5620',
  },
  {
    name: 'University of Port Harcourt Teaching Hospital (UPTH)',
    state: 'Rivers',
    city: 'Port Harcourt',
    address: 'East-West Road, Port Harcourt, Rivers State',
    emergency_phone: '+234 84 461 400',
  },
];

@Injectable()
export class TriageService {
  private readonly logger = new Logger(TriageService.name);
  private memoryRedirectLogs: any[] = [];

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Optional() private redis?: RedisService,
    @Optional() private notifications?: NotificationsService,
  ) {}

  /**
   * Evaluates patient red flags and symptoms
   */
  async evaluate(dto: EvaluateTriageDto, currentUserId?: string) {
    const patientId = dto.patient_id || currentUserId || 'ANONYMOUS_PATIENT';

    const triageInput: TriageEvaluationInput = {
      patient_id: patientId,
      selected_red_flags: dto.selected_red_flags as RedFlagCode[],
      chief_complaint: dto.chief_complaint,
      clarification_response: dto.clarification_response,
    };

    const evaluation = evaluateTriage(triageInput);

    if (evaluation.status === 'HALT_AND_REDIRECT') {
      // 1. Log immutable record to emergency_redirect_log
      const logData = {
        patient_id: patientId.includes('-') && patientId.length === 36 ? patientId : undefined,
        symptoms_flagged: evaluation.symptoms_flagged,
        ambiguous_input: dto.chief_complaint,
        clarification_response: dto.clarification_response || null,
        timestamp: new Date(),
        action_taken: 'REDIRECTED_TO_EMERGENCY_AMBULANCE_112',
      };

      if (this.prisma.isConnected && logData.patient_id) {
        try {
          await this.prisma.emergencyRedirectLog.create({
            data: {
              patient_id: logData.patient_id,
              symptoms_flagged: logData.symptoms_flagged,
              ambiguous_input: logData.ambiguous_input,
              clarification_response: logData.clarification_response,
              action_taken: logData.action_taken,
              timestamp: logData.timestamp,
            },
          });
        } catch (err: any) {
          this.logger.warn(`Failed to persist emergency redirect log to DB: ${err?.message}`);
        }
      }

      this.memoryRedirectLogs.push({ id: `erl_${Date.now()}`, ...logData, raw_patient_id: patientId });

      // 2. Emit Real-time alert for Admin/Ops + FCM
      this.logger.error(
        `[CRITICAL EMERGENCY REDIRECT] Patient: ${patientId} | Red Flags: [${evaluation.symptoms_flagged.join(', ')}] | Action: EMERGENCY AMBULANCE REDIRECT (112/767)`,
      );
      void this.notifications?.alertAdminEmergencyTriage(patientId, evaluation.symptoms_flagged);

      return {
        ...evaluation,
        emergency_contacts: {
          nationalEmergencyNumber: '112',
          ambulanceHotline: '767', // LASAMBUS
          frscEmergency: '122',
          notice:
            'Your reported symptoms require immediate emergency care. Persistent tap-to-call is activated. Manga Healthcare remote triage has blocked online booking.',
        },
        nearest_hospital_facilities: NIGERIA_EMERGENCY_FACILITIES,
        triage_clearance_token: null,
      };
    }

    if (evaluation.status === 'ASK_CLARIFYING_QUESTION') {
      return {
        ...evaluation,
        triage_clearance_token: null,
      };
    }

    // Branch: CLEAR_TO_BOOK
    // Issue signed short-lived triage clearance token (15-minute expiry + Redis JTI)
    const jti = crypto.randomUUID();
    const clearancePayload = {
      type: 'TRIAGE_CLEARANCE',
      jti,
      patient_id: patientId,
      chief_complaint: dto.chief_complaint,
      cleared_at: new Date().toISOString(),
    };

    const token = this.jwtService.sign(clearancePayload, { expiresIn: '15m' });
    await this.redis?.set(`triage_clearance:${jti}`, patientId, 900);

    this.logger.log(`[TRIAGE CLEARED] Patient: ${patientId} | Clearance token issued.`);

    return {
      status: 'CLEAR_TO_BOOK',
      symptoms_flagged: [],
      message: 'Triage assessment complete. You are cleared to proceed to consultation booking or instant queue.',
      triage_clearance_token: token,
    };
  }

  /**
   * Validates a signed triage clearance token
   */
  validateClearanceToken(token: string): { patient_id: string; chief_complaint: string } {
    try {
      const decoded = this.jwtService.verify(token);
      if (decoded.type !== 'TRIAGE_CLEARANCE') {
        throw new ForbiddenException('Token is not a valid triage clearance token');
      }
      return {
        patient_id: decoded.patient_id,
        chief_complaint: decoded.chief_complaint,
      };
    } catch {
      throw new ForbiddenException('Invalid or expired triage clearance token');
    }
  }

  /**
   * Retrieves all emergency redirect logs for Admin/Ops
   */
  async getEmergencyLogs() {
    if (this.prisma.isConnected) {
      try {
        const logs = await this.prisma.emergencyRedirectLog.findMany({
          orderBy: { timestamp: 'desc' },
          include: { patient: true },
        });
        if (logs.length > 0) return logs;
      } catch (err: any) {
        this.logger.warn(`Failed to retrieve emergency logs from DB: ${err?.message}`);
      }
    }
    return this.memoryRedirectLogs;
  }
}
