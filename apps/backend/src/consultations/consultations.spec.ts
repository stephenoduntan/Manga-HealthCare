import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationsService } from './consultations.service';
import { PdfService } from './pdf.service';
import { StorageService } from '../common/storage/storage.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { ConsultationMode } from '@prisma/client';

describe('ConsultationsService (Session, Notes & PDF E-Prescriptions)', () => {
  let service: ConsultationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultationsService,
        PdfService,
        StorageService,
        {
          provide: PrismaService,
          useValue: {
            isConnected: false,
          },
        },
      ],
    }).compile();

    service = module.get<ConsultationsService>(ConsultationsService);
  });

  it('should start a consultation session with Daily.co room and call tokens', async () => {
    const startRes = await service.startSession(
      {
        booking_id: 'booking-consult-001',
        mode: ConsultationMode.VIDEO,
      },
      'doctor-uuid-001',
    );

    expect(startRes.consultation_id).toBeDefined();
    expect(startRes.session_credentials.room_url).toContain('daily.co');
    expect(startRes.session_credentials.call_token).toBeDefined();
    expect(startRes.session_credentials.chat_fallback_channel).toBeDefined();
  });

  it('should upload a clinical rash/wound image during an active consultation', async () => {
    const session = await service.startSession(
      { booking_id: 'booking-consult-002' },
      'doc-002',
    );

    const mockImageFile: any = {
      originalname: 'erythema_multiforme.jpg',
      buffer: Buffer.from('fake-image-bytes-jpeg'),
    };

    const uploadRes = await service.uploadImage(session.consultation_id, mockImageFile);
    expect(uploadRes.success).toBe(true);
    expect(uploadRes.image_url).toContain('/uploads/consultations/rash_');
    expect(uploadRes.uploaded_images.length).toBe(1);
  });

  it('should save structured clinical notes (Chief Complaint, Hx, Assessment, Plan)', async () => {
    const session = await service.startSession(
      { booking_id: 'booking-consult-003' },
      'doc-003',
    );

    const notesRes = await service.saveNotes(session.consultation_id, {
      notes: {
        chief_complaint: 'Persistent dry cough and mild fever',
        history_of_present_illness: 'Symptoms started 3 days ago after environmental exposure.',
        assessment: 'Acute upper respiratory tract infection (viral).',
        plan: 'Hydration, steam inhalation, paracetamol 1g TDS for 3 days.',
      },
      referral_note: 'Review at primary clinic if symptoms worsen beyond 5 days.',
    });

    expect(notesRes.success).toBe(true);
    expect(notesRes.notes.chief_complaint).toBe('Persistent dry cough and mild fever');
    expect(notesRes.notes.assessment).toBe('Acute upper respiratory tract infection (viral).');
  });

  it('should generate official MDCN-stamped E-Prescription and generate a valid PDF', async () => {
    const session = await service.startSession(
      { booking_id: 'booking-consult-004' },
      'doc-004',
    );

    const rxRes = await service.issuePrescription(
      session.consultation_id,
      {
        items: [
          {
            drug_name: 'Amoxicillin / Clavulanic Acid (Augmentin)',
            dosage: '625mg',
            frequency: 'Twice daily (BD)',
            duration: '7 days',
            instructions: 'Take with food or immediately after meals',
          },
          {
            drug_name: 'Paracetamol',
            dosage: '1000mg',
            frequency: 'Three times daily (TDS)',
            duration: '3 days',
            instructions: 'Take when fever or pain exceeds 38C',
          },
        ],
      },
      {
        name: 'Dr. Chioma Adebayo',
        public_id: 'DOC-CHIO01',
        mdcn_license_number: 'MDCN-78901',
        specialty: 'Family Medicine',
      },
    );

    expect(rxRes.success).toBe(true);
    expect(rxRes.prescription_id).toBeDefined();
    expect(rxRes.generated_pdf_url).toContain('/uploads/prescriptions/prescription_');

    // Verify PDF streaming buffer
    const pdfBuffer = await service.getPrescriptionPdfBuffer(session.consultation_id);
    expect(pdfBuffer).toBeDefined();
    expect(pdfBuffer.length).toBeGreaterThan(500); // Valid PDF header and binary
    expect(pdfBuffer.slice(0, 4).toString()).toBe('%PDF');
  });
});
