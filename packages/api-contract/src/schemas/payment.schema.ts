import { z } from 'zod';

export const PaymentProviderEnum = z.enum(['PAYSTACK', 'FLUTTERWAVE']);
export type PaymentProvider = z.infer<typeof PaymentProviderEnum>;

export const PayoutCycleStatusEnum = z.enum(['ACCRUED', 'PAID_BIWEEKLY']);
export type PayoutCycleStatus = z.infer<typeof PayoutCycleStatusEnum>;

export const PaymentRecordStatusEnum = z.enum([
  'PENDING',
  'SUCCESS',
  'FAILED',
  'REFUNDED',
]);
export type PaymentRecordStatus = z.infer<typeof PaymentRecordStatusEnum>;

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  booking_id: z.string().uuid(),
  doctor_id: z.string().uuid().nullable().optional(),
  amount: z.coerce.number().positive(),
  platform_commission: z.coerce.number().nonnegative(),
  doctor_accrued_fee: z.coerce.number().nonnegative(),
  payout_cycle_status: PayoutCycleStatusEnum.default('ACCRUED'),
  provider: PaymentProviderEnum,
  provider_reference: z.string().min(1),
  status: PaymentRecordStatusEnum.default('PENDING'),
  created_at: z.date().default(() => new Date()),
});

export type Payment = z.infer<typeof PaymentSchema>;

export const InitializePaymentDtoSchema = z.object({
  booking_id: z.string().uuid(),
  provider: PaymentProviderEnum,
  callback_url: z.string().url().optional(),
});
export type InitializePaymentDto = z.infer<typeof InitializePaymentDtoSchema>;
