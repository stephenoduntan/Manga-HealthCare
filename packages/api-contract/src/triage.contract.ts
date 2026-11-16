import { z } from 'zod';

/**
 * 8 Red-Flag Emergency Symptoms hardcoded exactly from Section 6 of PRD
 */
export const RED_FLAG_SYMPTOMS = [
  {
    code: 'CHEST_PAIN_PRESSURE',
    label: 'Chest pain / pressure',
    description: 'Any heavy pressure, tightness, squeezing, or aching in the chest or arms.',
  },
  {
    code: 'DIFFICULTY_BREATHING',
    label: 'Difficulty breathing',
    description: 'Severe shortness of breath, gasping, choking, or inability to speak in full sentences.',
  },
  {
    code: 'SEVERE_UNCONTROLLED_BLEEDING',
    label: 'Severe/uncontrolled bleeding',
    description: 'Continuous heavy bleeding that does not stop after direct pressure.',
  },
  {
    code: 'STROKE_SIGNS',
    label: 'Sudden weakness, facial drooping, slurred speech',
    description: 'Signs of stroke: face drooping, arm weakness, speech difficulty or numbness on one side.',
  },
  {
    code: 'LOSS_OF_CONSCIOUSNESS_SEIZURE',
    label: 'Loss of consciousness or seizure',
    description: 'Fainting, collapse, unresponsive episodes, active convulsion, or post-seizure confusion.',
  },
  {
    code: 'SEVERE_ALLERGIC_REACTION',
    label: 'Severe allergic reaction (swelling, difficulty swallowing/breathing)',
    description: 'Swelling of lips, tongue, throat, severe hives, dizziness, or anaphylaxis.',
  },
  {
    code: 'SUICIDAL_IDEATION_SELF_HARM',
    label: 'Suicidal ideation or intent to self-harm',
    description: 'Thoughts of ending life, immediate self-harm intention, or crisis.',
  },
  {
    code: 'PREGNANCY_ABDOMINAL_PAIN_BLEEDING',
    label: 'Severe abdominal pain or bleeding in pregnancy',
    description: 'Any acute sharp abdominal pain, vaginal bleeding, or fluid leakage during pregnancy.',
  },
] as const;

export const RedFlagCodeEnum = z.enum([
  'CHEST_PAIN_PRESSURE',
  'DIFFICULTY_BREATHING',
  'SEVERE_UNCONTROLLED_BLEEDING',
  'STROKE_SIGNS',
  'LOSS_OF_CONSCIOUSNESS_SEIZURE',
  'SEVERE_ALLERGIC_REACTION',
  'SUICIDAL_IDEATION_SELF_HARM',
  'PREGNANCY_ABDOMINAL_PAIN_BLEEDING',
]);
export type RedFlagCode = z.infer<typeof RedFlagCodeEnum>;

/**
 * 3-Branch State Machine Outcomes
 */
export const TriageStatusEnum = z.enum([
  'HALT_AND_REDIRECT',
  'ASK_CLARIFYING_QUESTION',
  'CLEAR_TO_BOOK',
]);
export type TriageStatus = z.infer<typeof TriageStatusEnum>;

/**
 * Triage Submission Input Schema
 */
export const TriageEvaluationInputSchema = z.object({
  patient_id: z.string().uuid().or(z.string().min(1)),
  selected_red_flags: z.array(RedFlagCodeEnum),
  chief_complaint: z.string().min(1, 'Chief complaint or reason for consultation is required'),
  clarification_response: z.string().optional(),
});
export type TriageEvaluationInput = z.infer<typeof TriageEvaluationInputSchema>;

/**
 * Triage Evaluation Result Schema
 */
export const TriageEvaluationResultSchema = z.object({
  status: TriageStatusEnum,
  symptoms_flagged: z.array(RedFlagCodeEnum),
  message: z.string(),
  clarifying_question: z.string().optional(),
  emergency_contacts: z
    .object({
      nationalEmergencyNumber: z.string().default('112'),
      ambulanceHotline: z.string().default('767'),
      notice: z.string(),
    })
    .optional(),
});
export type TriageEvaluationResult = z.infer<typeof TriageEvaluationResultSchema>;

/**
 * Ambiguous terms that indicate potentially severe acute conditions requiring location/context clarification
 */
const AMBIGUOUS_PATTERNS = [
  /severe\s+pain/i,
  /unbearable\s+pain/i,
  /worst\s+pain/i,
  /bleeding/i,
  /collapsed/i,
  /fainted/i,
  /can't\s+breathe/i,
  /cannot\s+breathe/i,
];

/**
 * Pure state machine evaluator for triage compliance
 */
export function evaluateTriage(input: TriageEvaluationInput): TriageEvaluationResult {
  // Branch 1: Any explicit red-flag selected -> HALT_AND_REDIRECT immediately
  if (input.selected_red_flags.length > 0) {
    return {
      status: 'HALT_AND_REDIRECT',
      symptoms_flagged: input.selected_red_flags,
      message:
        'Your symptoms indicate a potential medical emergency. Manga Healthcare is a remote consultation service and cannot provide emergency stabilization.',
      emergency_contacts: {
        nationalEmergencyNumber: '112',
        ambulanceHotline: '767',
        notice:
          'Please visit the nearest emergency medical facility or call national emergency lines immediately. Persistent tap-to-call is enabled below.',
      },
    };
  }

  // Branch 2: Ambiguous text without prior clarification -> ASK_CLARIFYING_QUESTION
  if (!input.clarification_response || input.clarification_response.trim().length === 0) {
    for (const pattern of AMBIGUOUS_PATTERNS) {
      if (pattern.test(input.chief_complaint)) {
        return {
          status: 'ASK_CLARIFYING_QUESTION',
          symptoms_flagged: [],
          message:
            'You mentioned severe discomfort or pain. To ensure your clinical safety, please specify the exact location, duration, and whether you are experiencing dizziness or chest tightness.',
          clarifying_question:
            'Where exactly is this severe pain located, how long has it lasted, and are you having any trouble breathing or chest tightness?',
        };
      }
    }
  }

  // Branch 2b: If clarification response was provided, check if it reveals an emergency
  if (input.clarification_response) {
    const combined = `${input.chief_complaint} ${input.clarification_response}`;
    if (
      /chest/i.test(combined) &&
      (/pain/i.test(combined) || /tight/i.test(combined) || /pressure/i.test(combined))
    ) {
      return {
        status: 'HALT_AND_REDIRECT',
        symptoms_flagged: ['CHEST_PAIN_PRESSURE'],
        message: 'Reported chest symptoms require immediate emergency in-person medical evaluation.',
        emergency_contacts: {
          nationalEmergencyNumber: '112',
          ambulanceHotline: '767',
          notice: 'Call emergency services or proceed immediately to the nearest hospital.',
        },
      };
    }
    if (/head/i.test(combined) && /sudden/i.test(combined) && /severe/i.test(combined)) {
      return {
        status: 'HALT_AND_REDIRECT',
        symptoms_flagged: ['STROKE_SIGNS'],
        message: 'Sudden severe neurological or head pain requires urgent emergency evaluation.',
        emergency_contacts: {
          nationalEmergencyNumber: '112',
          ambulanceHotline: '767',
          notice: 'Call emergency services or proceed immediately to the nearest hospital.',
        },
      };
    }
  }

  // Branch 3: Safe to book
  return {
    status: 'CLEAR_TO_BOOK',
    symptoms_flagged: [],
    message: 'Triage assessment complete. You are cleared to proceed to consultation booking or instant queue.',
  };
}
