import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { TriageService, EmergencyFacility } from './triage.service';
import { PrismaService } from '../common/prisma/prisma.service';

describe('TriageService (Mandatory Emergency Triage Engine)', () => {
  let service: TriageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret-key-triage',
          signOptions: { expiresIn: '30m' },
        }),
      ],
      providers: [
        TriageService,
        {
          provide: PrismaService,
          useValue: {
            isConnected: false,
            emergencyRedirectLog: { create: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<TriageService>(TriageService);
  });

  it('should HALT and REDIRECT when chest pain red-flag symptom is selected', async () => {
    const result: any = await service.evaluate({
      patient_id: 'pat-123',
      selected_red_flags: ['CHEST_PAIN_PRESSURE'],
      chief_complaint: 'Heavy tightness across my chest',
    });

    expect(result.status).toBe('HALT_AND_REDIRECT');
    expect(result.symptoms_flagged).toContain('CHEST_PAIN_PRESSURE');
    expect(result.triage_clearance_token).toBeNull();
    expect(result.emergency_contacts?.nationalEmergencyNumber).toBe('112');
    expect(result.emergency_contacts?.ambulanceHotline).toBe('767');
    expect(result.nearest_hospital_facilities).toBeDefined();
    expect(result.nearest_hospital_facilities.length).toBeGreaterThanOrEqual(4);
    expect(result.nearest_hospital_facilities.some((f: EmergencyFacility) => f.name.includes('LASUTH'))).toBe(true);
  });

  it('should ASK_CLARIFYING_QUESTION when ambiguous free-text indicates severe pain without details', async () => {
    const result: any = await service.evaluate({
      patient_id: 'pat-123',
      selected_red_flags: [],
      chief_complaint: 'I am experiencing severe pain since yesterday',
    });

    expect(result.status).toBe('ASK_CLARIFYING_QUESTION');
    expect(result.clarifying_question).toBeDefined();
    expect(result.triage_clearance_token).toBeNull();
  });

  it('should HALT and REDIRECT if clarification response reveals chest emergency', async () => {
    const result: any = await service.evaluate({
      patient_id: 'pat-123',
      selected_red_flags: [],
      chief_complaint: 'I have severe pain',
      clarification_response: 'It is a sharp chest pain radiating down my left arm',
    });

    expect(result.status).toBe('HALT_AND_REDIRECT');
    expect(result.symptoms_flagged).toContain('CHEST_PAIN_PRESSURE');
    expect(result.triage_clearance_token).toBeNull();
  });

  it('should CLEAR_TO_BOOK and issue a signed short-lived clearance token when symptoms are non-emergency', async () => {
    const result = await service.evaluate({
      patient_id: 'pat-123',
      selected_red_flags: [],
      chief_complaint: 'Mild cough and runny nose for 2 days',
    });

    expect(result.status).toBe('CLEAR_TO_BOOK');
    expect(result.triage_clearance_token).toBeDefined();
    expect(typeof result.triage_clearance_token).toBe('string');

    // Verify token validation
    const validated = service.validateClearanceToken(result.triage_clearance_token!);
    expect(validated.patient_id).toBe('pat-123');
    expect(validated.chief_complaint).toBe('Mild cough and runny nose for 2 days');
  });
});
