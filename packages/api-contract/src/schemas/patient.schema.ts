import { z } from 'zod';

export const MedicalHistoryItemSchema = z.object({
  name: z.string(),
  diagnosed_year: z.number().int().optional(),
  notes: z.string().optional(),
});

export const AllergyItemSchema = z.object({
  allergen: z.string(),
  reaction: z.string().optional(),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE']).optional(),
});

export const MedicationItemSchema = z.object({
  drug_name: z.string(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
});

export const PatientProfileSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  date_of_birth: z.coerce.date().nullable().optional(),
  preferred_languages: z.array(z.string()).default(['English']),
  allergies: z.union([z.string(), z.array(AllergyItemSchema), z.any()]).nullable().optional(),
  existing_conditions: z.union([z.string(), z.array(MedicalHistoryItemSchema), z.any()]).nullable().optional(),
  current_medications: z.union([z.string(), z.array(MedicationItemSchema), z.any()]).nullable().optional(),
});

export type PatientProfile = z.infer<typeof PatientProfileSchema>;

export const UpdatePatientIntakeDtoSchema = PatientProfileSchema.omit({
  id: true,
  user_id: true,
});
export type UpdatePatientIntakeDto = z.infer<typeof UpdatePatientIntakeDtoSchema>;
