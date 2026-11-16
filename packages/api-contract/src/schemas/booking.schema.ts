import { z } from 'zod';

export const BookingTypeEnum = z.enum([
  'INSTANT_QUEUE',
  'SCHEDULED',
  'THERAPY_MANDATORY_SLOT',
]);
export type BookingType = z.infer<typeof BookingTypeEnum>;

export const BookingStatusEnum = z.enum([
  'PENDING',
  'IN_QUEUE',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'REDIRECTED',
]);
export type BookingStatus = z.infer<typeof BookingStatusEnum>;

export const PaymentStatusEnum = z.enum(['UNPAID', 'PAID', 'REFUNDED']);
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

export const BookingSchema = z.object({
  id: z.string().uuid(),
  patient_id: z.string().uuid(),
  doctor_id: z.string().uuid().nullable().optional(),
  slot_id: z.string().uuid().nullable().optional(),
  booking_type: BookingTypeEnum,
  is_followup: z.boolean().default(false),
  status: BookingStatusEnum.default('PENDING'),
  triage_flagged: z.boolean().default(false),
  payment_status: PaymentStatusEnum.default('UNPAID'),
  created_at: z.date().default(() => new Date()),
});

export type Booking = z.infer<typeof BookingSchema>;

export const CreateBookingDtoSchema = z.object({
  patient_id: z.string().uuid(),
  doctor_id: z.string().uuid().optional(),
  slot_id: z.string().uuid().optional(),
  booking_type: BookingTypeEnum,
  is_followup: z.boolean().default(false),
}).refine(
  (data) => {
    // If therapy mandatory slot, slot_id must be provided
    if (data.booking_type === 'THERAPY_MANDATORY_SLOT') {
      return !!data.slot_id && !!data.doctor_id;
    }
    // If scheduled, slot_id must be provided
    if (data.booking_type === 'SCHEDULED') {
      return !!data.slot_id && !!data.doctor_id;
    }
    return true;
  },
  {
    message: 'Scheduled or Therapy sessions require a doctor and an availability slot',
    path: ['slot_id'],
  }
);

export type CreateBookingDto = z.infer<typeof CreateBookingDtoSchema>;
