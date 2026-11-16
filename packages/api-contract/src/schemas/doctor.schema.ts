import { z } from 'zod';

export const DoctorVerificationStatusEnum = z.enum([
  'PENDING',
  'VERIFIED',
  'REJECTED',
]);
export type DoctorVerificationStatus = z.infer<typeof DoctorVerificationStatusEnum>;

export const DoctorProfileSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  specialty: z.string().min(2, 'Specialty is required (e.g., General Practice, Pediatrics, Mental Health)'),
  is_locum: z.boolean().default(false),
  mdcn_license_number: z.string().min(3, 'Valid MDCN License Number is mandatory'),
  medical_degree_details: z.string().min(2, 'Medical school & graduation qualifications'),
  verification_status: DoctorVerificationStatusEnum.default('PENDING'),
  bio: z.string().nullable().optional(),
  languages: z.array(z.string()).default(['English']),
  consultation_fee: z.coerce.number().positive('Consultation fee must be greater than zero'),
  followup_fee: z.coerce.number().nonnegative('Follow-up fee cannot be negative').default(0),
});

export type DoctorProfile = z.infer<typeof DoctorProfileSchema>;

export const CreateDoctorProfileDtoSchema = DoctorProfileSchema.omit({
  id: true,
  verification_status: true,
});
export type CreateDoctorProfileDto = z.infer<typeof CreateDoctorProfileDtoSchema>;
