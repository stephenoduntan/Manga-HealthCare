import { z } from 'zod';
import { RedFlagCodeEnum } from '../triage.contract';

export const EmergencyRedirectLogSchema = z.object({
  id: z.string().uuid(),
  patient_id: z.string().uuid(),
  symptoms_flagged: z.array(z.string()),
  ambiguous_input: z.string().nullable().optional(),
  clarification_response: z.string().nullable().optional(),
  timestamp: z.date().default(() => new Date()),
  action_taken: z.string().default('REDIRECTED_TO_EMERGENCY_AMBULANCE_112'),
});

export type EmergencyRedirectLog = z.infer<typeof EmergencyRedirectLogSchema>;

export const CreateEmergencyRedirectDtoSchema = z.object({
  patient_id: z.string().uuid(),
  symptoms_flagged: z.array(z.string()),
  ambiguous_input: z.string().optional(),
  clarification_response: z.string().optional(),
  action_taken: z.string().default('REDIRECTED_TO_EMERGENCY_AMBULANCE_112'),
});
export type CreateEmergencyRedirectDto = z.infer<typeof CreateEmergencyRedirectDtoSchema>;
