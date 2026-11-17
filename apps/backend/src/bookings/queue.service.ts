import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../common/redis/redis.service';

export interface QueueEntry {
  booking_id: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  chief_complaint: string;
  enqueued_at: string;
  priority: number;
}

export interface SurgeAlert {
  id: string;
  triggered_at: string;
  queue_depth: number;
  estimated_wait_minutes: number;
  message: string;
  status: 'ACTIVE' | 'RESOLVED';
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private readonly QUEUE_KEY = 'lobby:doctor_now';
  private activeSurgeAlert: SurgeAlert | null = null;
  private surgeHistory: SurgeAlert[] = [];

  constructor(private redis: RedisService) {}

  /**
   * Enqueues patient for "Talk to Doctor Now" instant lobby
   */
  async enqueuePatient(
    bookingId: string,
    patientId: string,
    patientName: string,
    patientPhone: string,
    chiefComplaint: string,
  ) {
    const entry: QueueEntry = {
      booking_id: bookingId,
      patient_id: patientId,
      patient_name: patientName,
      patient_phone: patientPhone,
      chief_complaint: chiefComplaint,
      enqueued_at: new Date().toISOString(),
      priority: 1,
    };

    const newLength = await this.redis.pushQueue(this.QUEUE_KEY, entry);
    const position = newLength;
    const estimatedWaitMinutes = position * 4; // Average 4 mins per consultation slot

    this.logger.log(
      `[LOBBY QUEUE] Patient ${patientName} (${patientId}) joined queue at position #${position}. Est wait: ${estimatedWaitMinutes}m`,
    );

    // PRD Rule: Trigger LOCUM_SURGE_ALERT if wait exceeds 7 minutes or queue depth spikes (>3)
    if (estimatedWaitMinutes > 7 || newLength > 3) {
      this.triggerSurgeAlert(newLength, estimatedWaitMinutes);
    }

    return {
      queue_position: position,
      estimated_wait_minutes: estimatedWaitMinutes,
      is_surge_active: !!this.activeSurgeAlert,
    };
  }

  /**
   * Trigger Locum Surge Alert
   */
  private triggerSurgeAlert(depth: number, waitMinutes: number) {
    const alert: SurgeAlert = {
      id: `surge_${Date.now()}`,
      triggered_at: new Date().toISOString(),
      queue_depth: depth,
      estimated_wait_minutes: waitMinutes,
      message: `LOCUM_SURGE_ALERT: Lobby queue exceeds safe threshold (Queue Depth: ${depth}, Estimated Wait: ${waitMinutes} mins > 7 mins limit). Urgent: Deploy on-demand locum doctors.`,
      status: 'ACTIVE',
    };

    this.activeSurgeAlert = alert;
    this.surgeHistory.unshift(alert);

    this.logger.error(`[LOCUM_SURGE_ALERT] ${alert.message}`);
  }

  /**
   * Doctor claims next patient from the lobby queue
   */
  async claimNextPatient(): Promise<QueueEntry | null> {
    const nextPatient = await this.redis.popQueue(this.QUEUE_KEY);
    if (!nextPatient) {
      return null;
    }

    const remaining = await this.redis.getQueueLength(this.QUEUE_KEY);
    const remainingWait = remaining * 4;

    if (remaining <= 2 && remainingWait <= 7 && this.activeSurgeAlert) {
      this.activeSurgeAlert.status = 'RESOLVED';
      this.logger.log('[SURGE RESOLVED] Lobby queue normalized below surge threshold.');
      this.activeSurgeAlert = null;
    }

    return nextPatient;
  }

  /**
   * Current queue status
   */
  async getQueueStatus() {
    const items = await this.redis.getQueue(this.QUEUE_KEY);
    const length = items.length;
    const estimatedWait = length * 4;

    return {
      queue_length: length,
      estimated_wait_minutes: estimatedWait,
      is_surge: length > 3 || estimatedWait > 7,
      active_surge_alert: this.activeSurgeAlert,
      items: items.map((item, index) => ({
        ...item,
        current_position: index + 1,
      })),
    };
  }

  /**
   * Remove specific booking if cancelled
   */
  async removePatient(bookingId: string): Promise<boolean> {
    return this.redis.removeFromQueue(this.QUEUE_KEY, 'booking_id', bookingId);
  }

  /**
   * Admin Surge Alerts query
   */
  getSurgeAlerts() {
    return {
      active_surge: this.activeSurgeAlert,
      history: this.surgeHistory,
    };
  }
}
