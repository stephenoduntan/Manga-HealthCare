import { z } from 'zod';

export const UserRoleEnum = z.enum([
  'PATIENT',
  'DOCTOR',
  'THERAPIST',
  'LOCUM',
  'ADMIN',
  'PARTNER',
]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const PublicIdRegex = /^(PAT|DOC|LOC|ADM|PRT)-[A-Z0-9]{4,8}$/;

export const UserSchema = z.object({
  id: z.string().uuid(),
  public_id: z
    .string()
    .regex(PublicIdRegex, 'Public ID must follow format PAT-XXXX, DOC-XXXX, LOC-XXXX, etc.'),
  role: UserRoleEnum,
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email().nullable().optional(),
  auth_id: z.string().min(1, 'Firebase or Auth0 authentication ID'),
  telemedicine_consent: z.boolean().default(false),
  ndpr_consent: z.boolean().default(false),
  created_at: z.date().default(() => new Date()),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserDtoSchema = UserSchema.omit({
  id: true,
  created_at: true,
}).extend({
  email: z.string().email().optional(),
});
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
