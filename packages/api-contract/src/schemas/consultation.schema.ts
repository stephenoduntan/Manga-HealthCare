import { z } from 'zod';

export const ConsultationModeEnum = z.enum(['VIDEO', 'AUDIO', 'CHAT']);
export type ConsultationMode = z.infer<typeof ConsultationModeEnum>;

export const StructuredClinicalNoteSchema = z.object({
  chief_complaint: z.string().min(1, 'Chief complaint is required'),
  history_of_present_illness: z.string().min(1, 'History of present illness is required'),
  assessment: z.string().min(1, 'Clinical assessment/diagnosis is required'),
  plan: z.string().min(1, 'Care plan / management advice is required'),
});

export type StructuredClinicalNote = z.infer<typeof StructuredClinicalNoteSchema>;

export const LabRequestItemSchema = z.object({
  test_name: z.string().min(1),
  clinical_indication: z.string().optional(),
  urgency: z.enum(['ROUTINE', 'URGENT']).default('ROUTINE'),
});
export type LabRequestItem = z.infer<typeof LabRequestItemSchema>;

export const ConsultationSchema = z.object({
  id: z.string().uuid(),
  booking_id: z.string().uuid(),
  start_time: z.coerce.date().nullable().optional(),
  end_time: z.coerce.date().nullable().optional(),
  mode: ConsultationModeEnum.default('VIDEO'),
  notes: StructuredClinicalNoteSchema.nullable().optional(),
  uploaded_images: z.array(z.string().url()).default([]),
  referral_note: z.string().nullable().optional(),
  lab_requests: z.array(LabRequestItemSchema).nullable().optional(),
  created_at: z.date().default(() => new Date()),
});

export type Consultation = z.infer<typeof ConsultationSchema>;

export const UpdateConsultationNoteDtoSchema = z.object({
  notes: StructuredClinicalNoteSchema,
  referral_note: z.string().optional(),
  lab_requests: z.array(LabRequestItemSchema).optional(),
});
export type UpdateConsultationNoteDto = z.infer<typeof UpdateConsultationNoteDtoSchema>;
