import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaymentProvider, PaymentRecordStatus } from '@prisma/client';

describe('PaymentsService (Payments, 80/20 Split & Biweekly Doctor Ledger)', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: {
            isConnected: false,
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should calculate standard fee (₦15,000) and 80/20 split (Doctor: ₦12,000, Platform: ₦3,000)', async () => {
    const fee = await service.calculateFeeAndSplit('booking-standard-123');

    expect(fee.total_amount).toBe(15000);
    expect(fee.platform_commission).toBe(3000);
    expect(fee.doctor_accrued_fee).toBe(12000);
    expect(fee.is_followup).toBe(false);
  });

  it('should initialize payment and return hosted checkout URL', async () => {
    const initRes = await service.initializePayment({
      booking_id: 'booking-std-001',
      provider: PaymentProvider.PAYSTACK,
    });

    expect(initRes.success).toBe(true);
    expect(initRes.reference).toBeDefined();
    expect(initRes.checkout_url).toContain('paystack.com');
    expect(initRes.amount_naira).toBe(15000);
    expect(initRes.breakdown.doctor_accrued_fee_80_percent).toBe(12000);
    expect(initRes.breakdown.platform_commission_20_percent).toBe(3000);

    // Verify payment
    const verifyRes = await service.verifyPayment({
      reference: initRes.reference,
    });
    expect(verifyRes.success).toBe(true);
    expect(verifyRes.status).toBe(PaymentRecordStatus.SUCCESS);
  });

  it('should calculate biweekly doctor ledger and payout countdown', async () => {
    const doctorId = 'doctor-uuid-ledger-test';

    // Initialize & verify two payments for this doctor
    const p1 = await service.initializePayment({
      booking_id: 'b-01',
      provider: PaymentProvider.PAYSTACK,
    });
    // Manually assign doctor_id in memory for testing
    const mem1 = (service as any).memoryPayments.get(p1.reference);
    mem1.doctor_id = doctorId;
    await service.verifyPayment({ reference: p1.reference });

    const p2 = await service.initializePayment({
      booking_id: 'b-02',
      provider: PaymentProvider.FLUTTERWAVE,
    });
    const mem2 = (service as any).memoryPayments.get(p2.reference);
    mem2.doctor_id = doctorId;
    await service.verifyPayment({ reference: p2.reference });

    const ledger = await service.getDoctorLedger(doctorId);

    expect(ledger.doctor_id).toBe(doctorId);
    expect(ledger.summary.completed_paid_consultations).toBe(2);
    expect(ledger.summary.total_accrued_naira).toBe(24000); // 12000 * 2
    expect(ledger.settlement_schedule.next_settlement_date).toBeDefined();
    expect(ledger.settlement_schedule.countdown.days).toBeGreaterThanOrEqual(0);
    expect(ledger.settlement_schedule.countdown.display).toContain('remaining until direct bank deposit');
  });
});
