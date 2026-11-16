import { z } from 'zod';

export const AuditActionEnum = z.enum([
  'READ_PATIENT_RECORD',
  'CREATE_PATIENT_INTAKE',
  'UPDATE_PATIENT_INTAKE',
  'TRIAGE_EVALUATION',
  'EMERGENCY_HALT',
  'BOOKING_CREATED',
  'QUEUE_JOINED',
  'CONSULTATION_STARTED',
  'CONSULTATION_ENDED',
  'CLINICAL_NOTE_SAVED',
  'PRESCRIPTION_ISSUED',
  'PRESCRIPTION_LOOKUP_PARTNER',
  'PAYMENT_INITIALIZED',
  'PAYMENT_VERIFIED',
  'MDCN_VERIFICATION_STATUS_UPDATED',
  'LOCUM_CREDENTIAL_ISSUED',
]);
export type AuditAction = z.infer<typeof AuditActionEnum>;

export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  action: z.string(),
  target_record: z.string().min(1, 'Target record identifier or entity reference is required'),
  timestamp: z.date().default(() => new Date()),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

export const CreateAuditLogDtoSchema = z.object({
  user_id: z.string().uuid(),
  action: z.string(),
  target_record: z.string().min(1),
});
export type CreateAuditLogDto = z.infer<typeof CreateAuditLogDtoSchema>;
