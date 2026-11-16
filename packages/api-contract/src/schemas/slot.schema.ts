import { z } from 'zod';

export const AvailabilitySlotSchema = z.object({
  id: z.string().uuid(),
  doctor_id: z.string().uuid(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  is_booked: z.boolean().default(false),
});

export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;

export const CreateAvailabilitySlotDtoSchema = AvailabilitySlotSchema.omit({
  id: true,
  is_booked: true,
}).refine((data) => data.end_time > data.start_time, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

export type CreateAvailabilitySlotDto = z.infer<typeof CreateAvailabilitySlotDtoSchema>;
