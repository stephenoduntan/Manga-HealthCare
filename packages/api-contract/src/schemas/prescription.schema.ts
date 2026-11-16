import { z } from 'zod';

export const PrescriptionItemSchema = z.object({
  drug_name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required (e.g. 500mg, 10ml)'),
  frequency: z.string().min(1, 'Frequency is required (e.g. 3 times daily, TDS, BD)'),
  duration: z.string().min(1, 'Duration is required (e.g. 5 days, 2 weeks)'),
  instructions: z.string().optional(),
});
export type PrescriptionItem = z.infer<typeof PrescriptionItemSchema>;

export const PrescriptionSchema = z.object({
  id: z.string().uuid(),
  consultation_id: z.string().uuid(),
  items: z.array(PrescriptionItemSchema).min(1, 'At least one prescription item is required'),
  generated_pdf_url: z.string().url().nullable().optional(),
  created_at: z.date().default(() => new Date()),
});

export type Prescription = z.infer<typeof PrescriptionSchema>;

export const CreatePrescriptionDtoSchema = z.object({
  consultation_id: z.string().uuid(),
  items: z.array(PrescriptionItemSchema).min(1, 'Must include at least one medication item'),
});
export type CreatePrescriptionDto = z.infer<typeof CreatePrescriptionDtoSchema>;
