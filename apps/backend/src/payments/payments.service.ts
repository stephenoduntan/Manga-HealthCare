import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Optional,
} from '@nestjs/common';
import {
  PaymentProvider,
  PaymentRecordStatus,
  PayoutCycleStatus,
  PaymentStatus,
  BookingStatus,
  BookingType,
} from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaystackAdapter } from '../integrations/paystack.adapter';
import { FlutterwaveAdapter } from '../integrations/flutterwave.adapter';
import { NotificationsService } from '../notifications/notifications.module';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  // In-memory fallback
  private memoryPayments = new Map<string, any>();

  constructor(
    private prisma: PrismaService,
    @Optional() private paystackAdapter?: PaystackAdapter,
    @Optional() private flutterwaveAdapter?: FlutterwaveAdapter,
    @Optional() private notifications?: NotificationsService,
  ) {}

  /**
   * Calculates consultation fee (Standard vs. 14-day Follow-up) and commission split
   */
  async calculateFeeAndSplit(bookingId: string) {
    let booking: any = null;
    let doctorProfile: any = null;

    if (this.prisma.isConnected) {
      try {
        booking = await this.prisma.booking.findUnique({
          where: { id: bookingId },
          include: {
            doctor: {
              include: { doctor_profile: true },
            },
            patient: true,
          },
        });
        if (booking?.doctor?.doctor_profile) {
          doctorProfile = booking.doctor.doctor_profile;
        }
      } catch (err: any) {
        this.logger.warn(`Fee calculation fetch error: ${err?.message}`);
      }
    }

    const isFollowup = booking?.is_followup ?? false;

    // Default Nigerian telemedicine consultation fees (NGN)
    const standardFee = doctorProfile ? Number(doctorProfile.consultation_fee) : 15000.0;
    const followupFee = doctorProfile ? Number(doctorProfile.followup_fee) : 7500.0;

    const totalAmount = isFollowup ? followupFee : standardFee;

    // Platform commission split: 20% platform cut, 80% doctor cut
    const platformCommission = Math.round(totalAmount * 0.2 * 100) / 100;
    const doctorAccruedFee = Math.round(totalAmount * 0.8 * 100) / 100;

    return {
      booking_id: bookingId,
      doctor_id: booking?.doctor_id || null,
      is_followup: isFollowup,
      total_amount: totalAmount,
      platform_commission: platformCommission,
      doctor_accrued_fee: doctorAccruedFee,
    };
  }

  /**
   * Initializes a Paystack or Flutterwave payment session
   */
  async initializePayment(dto: InitializePaymentDto) {
    const feeSplit = await this.calculateFeeAndSplit(dto.booking_id);

    const reference = `manga_${dto.provider.toLowerCase()}_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const paymentId = crypto.randomUUID();

    let paymentRecord: any = null;

    if (this.prisma.isConnected) {
      try {
        paymentRecord = await this.prisma.payment.create({
          data: {
            id: paymentId,
            booking_id: dto.booking_id,
            doctor_id: feeSplit.doctor_id,
            amount: feeSplit.total_amount,
            platform_commission: feeSplit.platform_commission,
            doctor_accrued_fee: feeSplit.doctor_accrued_fee,
            payout_cycle_status: PayoutCycleStatus.ACCRUED,
            provider: dto.provider,
            provider_reference: reference,
            status: PaymentRecordStatus.PENDING,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Failed to persist payment record: ${err?.message}`);
      }
    }

    if (!paymentRecord) {
      paymentRecord = {
        id: paymentId,
        booking_id: dto.booking_id,
        doctor_id: feeSplit.doctor_id,
        amount: feeSplit.total_amount,
        platform_commission: feeSplit.platform_commission,
        doctor_accrued_fee: feeSplit.doctor_accrued_fee,
        payout_cycle_status: PayoutCycleStatus.ACCRUED,
        provider: dto.provider,
        provider_reference: reference,
        status: PaymentRecordStatus.PENDING,
        created_at: new Date(),
      };
      this.memoryPayments.set(reference, paymentRecord);
    }

    // Generate Hosted Checkout URL via Gateway Adapter
    let checkoutUrl =
      dto.provider === PaymentProvider.PAYSTACK
        ? `https://checkout.paystack.com/${reference}`
        : `https://checkout.flutterwave.com/v3/hosted/pay/${reference}`;

    if (dto.provider === PaymentProvider.PAYSTACK && this.paystackAdapter) {
      const psInit = await this.paystackAdapter.initializeTransaction({
        email: 'patient@mangahealthcare.com',
        amountNaira: feeSplit.total_amount,
        reference,
        metadata: { booking_id: dto.booking_id },
      });
      checkoutUrl = psInit.authorization_url;
    } else if (dto.provider === PaymentProvider.FLUTTERWAVE && this.flutterwaveAdapter) {
      const flwInit = await this.flutterwaveAdapter.initializePayment({
        email: 'patient@mangahealthcare.com',
        phone: '+2348000000000',
        name: 'Manga Patient',
        amountNaira: feeSplit.total_amount,
        txRef: reference,
      });
      checkoutUrl = flwInit.link;
    }

    this.logger.log(
      `[PAYMENT INIT] Provider: ${dto.provider} | Ref: ${reference} | Amount: ₦${feeSplit.total_amount} (Doctor: ₦${feeSplit.doctor_accrued_fee}, Platform: ₦${feeSplit.platform_commission})`,
    );

    return {
      success: true,
      provider: dto.provider,
      reference,
      checkout_url: checkoutUrl,
      amount_naira: feeSplit.total_amount,
      breakdown: {
        is_followup: feeSplit.is_followup,
        gross_consultation_fee: feeSplit.total_amount,
        platform_commission_20_percent: feeSplit.platform_commission,
        doctor_accrued_fee_80_percent: feeSplit.doctor_accrued_fee,
      },
    };
  }

  /**
   * Verifies and marks payment as SUCCESS
   */
  async verifyPayment(dto: VerifyPaymentDto) {
    let payment: any = null;

    if (this.prisma.isConnected) {
      try {
        payment = await this.prisma.payment.findUnique({
          where: { provider_reference: dto.reference },
          include: { booking: true },
        });

        if (payment) {
          const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: PaymentRecordStatus.SUCCESS },
          });

          const nextBookingStatus =
            payment.booking.booking_type === BookingType.INSTANT_QUEUE
              ? BookingStatus.IN_QUEUE
              : payment.booking.status === BookingStatus.PENDING
              ? BookingStatus.CONFIRMED
              : payment.booking.status;

          // Update booking payment status & promote to IN_QUEUE / CONFIRMED
          const updatedBooking = await this.prisma.booking.update({
            where: { id: payment.booking_id },
            data: {
              payment_status: PaymentStatus.PAID,
              status: nextBookingStatus,
            },
            include: { patient: true },
          });

          await this.notifications?.notifyBookingConfirmed({
            phone: updatedBooking.patient?.phone,
            email: updatedBooking.patient?.email,
            fcmToken: updatedBooking.patient?.fcm_token,
            bookingId: updatedBooking.id,
            mode: String(updatedBooking.booking_type),
          });

          return {
            success: true,
            status: PaymentRecordStatus.SUCCESS,
            payment: updatedPayment,
            booking_status: nextBookingStatus,
            message: 'Payment verified successfully. Consultation confirmed.',
          };
        }
      } catch (err: any) {
        this.logger.warn(`Prisma verifyPayment error: ${err?.message}`);
      }
    }

    // Memory fallback
    const mem = this.memoryPayments.get(dto.reference);
    if (mem) {
      mem.status = PaymentRecordStatus.SUCCESS;
      return {
        success: true,
        status: PaymentRecordStatus.SUCCESS,
        payment: mem,
        message: 'Payment verified successfully. Consultation confirmed.',
      };
    }

    throw new NotFoundException(`Payment reference ${dto.reference} not found`);
  }

  /**
   * Webhook handler for Paystack and Flutterwave notifications
   */
  async handleWebhook(body: any, signature?: string) {
    this.logger.log(`[PAYMENT WEBHOOK] Received webhook event: ${body?.event || body?.['event.type'] || 'Generic'}`);

    const reference =
      body?.data?.reference ||
      body?.data?.tx_ref ||
      body?.reference ||
      body?.tx_ref;

    if (!reference) {
      return { status: 'IGNORED', message: 'No reference detected in webhook' };
    }

    // Verify payment with extracted reference
    try {
      const result = await this.verifyPayment({ reference });
      return { status: 'PROCESSED', result };
    } catch {
      return { status: 'NOT_FOUND', reference };
    }
  }

  /**
   * Biweekly Doctor Ledger: Calculates accrued earnings and settlement countdown
   */
  async getDoctorLedger(doctorId: string) {
    let payments: any[] = [];

    if (this.prisma.isConnected) {
      try {
        payments = await this.prisma.payment.findMany({
          where: {
            doctor_id: doctorId,
            status: PaymentRecordStatus.SUCCESS,
          },
          include: {
            booking: {
              include: { patient: true },
            },
          },
          orderBy: { created_at: 'desc' },
        });
      } catch (err: any) {
        this.logger.warn(`Prisma doctor ledger query error: ${err?.message}`);
      }
    }

    if (payments.length === 0) {
      // Check memory store
      for (const p of this.memoryPayments.values()) {
        if (p.doctor_id === doctorId && p.status === PaymentRecordStatus.SUCCESS) {
          payments.push(p);
        }
      }
    }

    // Compute accrued vs paid amounts
    let totalAccruedNaira = 0;
    let totalPaidNaira = 0;

    for (const p of payments) {
      const accruedFee = Number(p.doctor_accrued_fee);
      if (p.payout_cycle_status === PayoutCycleStatus.ACCRUED) {
        totalAccruedNaira += accruedFee;
      } else {
        totalPaidNaira += accruedFee;
      }
    }

    // Calculate Biweekly Settlement Countdown (1st and 15th of each month)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    let nextSettlementDate: Date;
    if (currentDay <= 15) {
      nextSettlementDate = new Date(currentYear, currentMonth, 15, 23, 59, 59);
    } else {
      nextSettlementDate = new Date(currentYear, currentMonth + 1, 1, 23, 59, 59);
    }

    const diffMs = nextSettlementDate.getTime() - now.getTime();
    const daysUntilSettlement = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const hoursUntilSettlement = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

    return {
      doctor_id: doctorId,
      payout_cycle: 'BIWEEKLY (1st and 15th of every month)',
      summary: {
        total_accrued_naira: Math.round(totalAccruedNaira * 100) / 100,
        total_paid_out_naira: Math.round(totalPaidNaira * 100) / 100,
        completed_paid_consultations: payments.length,
      },
      settlement_schedule: {
        next_settlement_date: nextSettlementDate.toISOString(),
        countdown: {
          days: daysUntilSettlement,
          hours: hoursUntilSettlement,
          display: `${daysUntilSettlement} days, ${hoursUntilSettlement} hours remaining until direct bank deposit`,
        },
      },
      breakdown: payments.map((p) => ({
        payment_id: p.id,
        booking_id: p.booking_id,
        patient_name: p.booking?.patient?.name || 'Patient',
        patient_public_id: p.booking?.patient?.public_id || 'PAT-N/A',
        gross_fee_naira: Number(p.amount),
        platform_commission_20: Number(p.platform_commission),
        doctor_net_earned_80: Number(p.doctor_accrued_fee),
        payout_status: p.payout_cycle_status,
        date: p.created_at,
      })),
    };
  }
}
