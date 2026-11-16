import { evaluateTriage, RED_FLAG_SYMPTOMS } from './triage.contract';

describe('Emergency-Symptom Triage Logic (PRD Section 6.0)', () => {
  it('should verify all 8 PRD Red-Flag Symptoms are present and defined', () => {
    expect(RED_FLAG_SYMPTOMS).toHaveLength(8);
    const codes = RED_FLAG_SYMPTOMS.map((s) => s.code);
    expect(codes).toContain('CHEST_PAIN_PRESSURE');
    expect(codes).toContain('DIFFICULTY_BREATHING');
    expect(codes).toContain('SEVERE_UNCONTROLLED_BLEEDING');
    expect(codes).toContain('STROKE_SIGNS');
    expect(codes).toContain('LOSS_OF_CONSCIOUSNESS_SEIZURE');
    expect(codes).toContain('SEVERE_ALLERGIC_REACTION');
    expect(codes).toContain('SUICIDAL_IDEATION_SELF_HARM');
    expect(codes).toContain('PREGNANCY_ABDOMINAL_PAIN_BLEEDING');
  });

  it('Branch 1: should immediately HALT_AND_REDIRECT when any red flag is selected', () => {
    const result = evaluateTriage({
      patient_id: 'PAT-0001',
      selected_red_flags: ['CHEST_PAIN_PRESSURE'],
      chief_complaint: 'Crushing chest pain since 20 minutes ago',
    });

    expect(result.status).toBe('HALT_AND_REDIRECT');
    expect(result.symptoms_flagged).toContain('CHEST_PAIN_PRESSURE');
    expect(result.emergency_contacts?.nationalEmergencyNumber).toBe('112');
  });

  it('Branch 2: should ASK_CLARIFYING_QUESTION when ambiguous free-text like "severe pain" lacks location', () => {
    const result = evaluateTriage({
      patient_id: 'PAT-0002',
      selected_red_flags: [],
      chief_complaint: 'I am in severe pain please help me',
    });

    expect(result.status).toBe('ASK_CLARIFYING_QUESTION');
    expect(result.clarifying_question).toBeDefined();
    expect(result.clarifying_question).toContain('Where exactly is this severe pain located');
  });

  it('Branch 2b: should HALT_AND_REDIRECT if clarification confirms a red-flag condition', () => {
    const result = evaluateTriage({
      patient_id: 'PAT-0002',
      selected_red_flags: [],
      chief_complaint: 'I am in severe pain please help me',
      clarification_response: 'It is severe chest pain and tight pressure in my ribs',
    });

    expect(result.status).toBe('HALT_AND_REDIRECT');
    expect(result.symptoms_flagged).toContain('CHEST_PAIN_PRESSURE');
  });

  it('Branch 3: should return CLEAR_TO_BOOK when no red flags or critical ambiguities are present', () => {
    const result = evaluateTriage({
      patient_id: 'PAT-0003',
      selected_red_flags: [],
      chief_complaint: 'Mild runny nose, sneezing, and slight throat itchiness for 2 days',
    });

    expect(result.status).toBe('CLEAR_TO_BOOK');
    expect(result.symptoms_flagged).toHaveLength(0);
  });
});
