import { Global, Injectable, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TermiiAdapter } from '../integrations/termii.adapter';
import { ResendAdapter } from '../integrations/resend.adapter';
import { FcmAdapter } from '../integrations/fcm.adapter';

export interface OtpDeliveryReport {
  channel: 'SMS' | 'EMAIL' | 'SANDBOX';
  provider: 'termii' | 'resend' | 'sandbox';
  provider_configured: boolean;
  live_delivered: boolean;
  missing_provider_note?: string;
}

/**
 * Centralized notification dispatcher coordinating Termii SMS, Resend Email, and Firebase FCM.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly termii: TermiiAdapter,
    private readonly resend: ResendAdapter,
    private readonly fcm: FcmAdapter,
    private readonly configService: ConfigService,
  ) {}

  getOtpProviderReadiness() {
    const termiiConfigured = Boolean(this.configService.get<string>('TERMII_API_KEY')?.trim());
    const resendConfigured = Boolean(this.configService.get<string>('RESEND_API_KEY')?.trim());
    return {
      sms_otp: {
        provider: 'termii',
        configured: termiiConfigured,
        required_env: ['TERMII_API_KEY', 'TERMII_SENDER_ID'],
      },
      email_otp: {
        provider: 'resend',
        configured: resendConfigured,
        required_env: ['RESEND_API_KEY', 'RESEND_FROM_EMAIL'],
      },
    };
  }

  async dispatchOtp(
    identifier: string,
    otp: string,
    phone?: string | null,
    email?: string | null,
  ): Promise<OtpDeliveryReport> {
    const isEmailIdentifier = identifier.includes('@');
    const targetEmail = email || (isEmailIdentifier ? identifier : null);
    const cleanedPhone = (phone || (!isEmailIdentifier ? identifier : '')).replace(/\s+/g, '');
    const targetPhone =
      cleanedPhone && (cleanedPhone.startsWith('+') || /^0\d{10}$/.test(cleanedPhone))
        ? cleanedPhone
        : null;

    if (isEmailIdentifier && targetEmail) {
      const res = await this.resend.sendEmail({
        to: targetEmail,
        subject: 'Your Manga Healthcare OTP Verification Code',
        html: `<p>Your 6-digit verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
      });
      return {
        channel: res.live ? 'EMAIL' : 'SANDBOX',
        provider: res.live ? 'resend' : 'sandbox',
        provider_configured: res.live,
        live_delivered: res.live && res.delivered,
        ...(!res.live
          ? {
              missing_provider_note:
                'RESEND_API_KEY is not configured; using sandbox OTP delivery.',
            }
          : {}),
      };
    }

    if (targetPhone) {
      const res = await this.termii.sendOtp(targetPhone, otp);
      return {
        channel: res.live ? 'SMS' : 'SANDBOX',
        provider: res.live ? 'termii' : 'sandbox',
        provider_configured: res.live,
        live_delivered: res.live && res.delivered,
        ...(!res.live
          ? {
              missing_provider_note:
                'TERMII_API_KEY is not configured; using sandbox OTP delivery.',
            }
          : {}),
      };
    }

    if (targetEmail) {
      const res = await this.resend.sendEmail({
        to: targetEmail,
        subject: 'Your Manga Healthcare OTP Verification Code',
        html: `<p>Your 6-digit verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
      });
      return {
        channel: res.live ? 'EMAIL' : 'SANDBOX',
        provider: res.live ? 'resend' : 'sandbox',
        provider_configured: res.live,
        live_delivered: res.live && res.delivered,
      };
    }

    return {
      channel: 'SANDBOX',
      provider: 'sandbox',
      provider_configured: false,
      live_delivered: false,
      missing_provider_note:
        'No external Termii SMS or Resend Email destination/API key configured; using sandbox OTP.',
    };
  }

  async notifyBookingConfirmed(params: {
    phone?: string | null;
    email?: string | null;
    fcmToken?: string | null;
    bookingId: string;
    mode: string;
  }) {
    const msg = `Manga Healthcare booking ${params.bookingId.slice(0, 8)} is confirmed (${params.mode}).`;
    if (params.phone) {
      await this.termii.sendSms(params.phone, msg);
    }
    if (params.email) {
      await this.resend.sendEmail({
        to: params.email,
        subject: 'Manga Healthcare Booking Confirmation',
        html: `<p>${msg}</p>`,
      });
    }
    await this.fcm.sendPush({
      token: params.fcmToken,
      title: 'Booking Confirmed',
      body: msg,
      data: { booking_id: params.bookingId },
    });
  }

  async notifyDoctorJoined(fcmToken: string | null | undefined, bookingId: string, doctorName: string) {
    await this.fcm.sendPush({
      token: fcmToken,
      title: 'Your doctor has joined the consultation room',
      body: `${doctorName} is ready to see you now.`,
      data: { booking_id: bookingId, event: 'DOCTOR_JOINED' },
    });
  }

  async notifyLocumCredentials(params: {
    name: string;
    phone?: string | null;
    email?: string | null;
    locumId: string;
  }) {
    const msg = `Welcome ${params.name}. Your urgent Locum ID is ${params.locumId}. Log in at doctor.mangahealthcare.com/auth using ${params.locumId} + OTP.`;
    if (params.phone) {
      await this.termii.sendSms(params.phone, msg);
    }
    if (params.email) {
      await this.resend.sendEmail({
        to: params.email,
        subject: `Manga Healthcare Urgent Locum Credentials (${params.locumId})`,
        html: `<p>${msg}</p>`,
      });
    }
  }

  async alertAdminEmergencyTriage(patientId: string, redFlags: string[]) {
    this.logger.warn(`[ADMIN FCM ALERT] Emergency triage red flag for ${patientId}: ${redFlags.join(', ')}`);
    await this.fcm.sendPush({
      topic: 'admin_emergency_alerts',
      title: 'Emergency Triage Red-Flag Triggered',
      body: `Patient ${patientId} flagged [${redFlags.join(', ')}] and diverted to 112/767.`,
      data: { patient_id: patientId, flags: redFlags.join(',') },
    });
  }

  async scheduleFollowupReminder(params: {
    userId: string;
    fcmToken?: string | null;
    title: string;
    message: string;
    remindAtIso: string;
  }) {
    await this.fcm.sendPush({
      token: params.fcmToken,
      title: params.title,
      body: params.message,
      data: { user_id: params.userId, remind_at: params.remindAtIso, type: 'FOLLOWUP_REMINDER' },
    });
    return {
      scheduled: true,
      user_id: params.userId,
      title: params.title,
      remind_at: params.remindAtIso,
    };
  }
}

@Global()
@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
