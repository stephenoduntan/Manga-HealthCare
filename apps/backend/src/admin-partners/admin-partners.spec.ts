import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AdminService } from '../admin/admin.service';
import { PartnersService } from '../partners/partners.service';
import { TriageService } from '../triage/triage.service';
import { QueueService } from '../bookings/queue.service';
import { RedisService } from '../common/redis/redis.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { Role, VerificationStatus } from '@prisma/client';

describe('Admin & Partners Modules (MDCN Approval, Locum ID & Partner Lookup)', () => {
  let adminService: AdminService;
  let partnersService: PartnersService;
  let triageService: TriageService;
  let queueService: QueueService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ secret: 'test-admin-secret', signOptions: { expiresIn: '1h' } }),
      ],
      providers: [
        AdminService,
        PartnersService,
        TriageService,
        QueueService,
        RedisService,
        {
          provide: PrismaService,
          useValue: {
            isConnected: false,
          },
        },
      ],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
    partnersService = module.get<PartnersService>(PartnersService);
    triageService = module.get<TriageService>(TriageService);
    queueService = module.get<QueueService>(QueueService);
    redisService = module.get<RedisService>(RedisService);

    await redisService.onModuleInit();
  });

  it('should approve a pending locum doctor and automatically issue a LOC-XXXX public ID', async () => {
    const doctorProfileId = 'locum-profile-001';
    const pendingLocum = {
      id: doctorProfileId,
      user_id: 'user-locum-001',
      is_locum: true,
      mdcn_license_number: 'MDCN-LOC-5555',
      verification_status: VerificationStatus.PENDING,
      user: {
        id: 'user-locum-001',
        name: 'Dr. Emeka Onuoha (Locum)',
        public_id: 'PAT-OLD99',
        role: Role.LOCUM,
      },
    };

    (adminService as any).memoryPendingDoctors.set(doctorProfileId, pendingLocum);

    const approval = await adminService.approveDoctor(doctorProfileId, 'admin-user-001');

    expect(approval.success).toBe(true);
    expect(approval.verification_status).toBe(VerificationStatus.VERIFIED);
    expect(approval.is_locum).toBe(true);
    expect(approval.public_id.startsWith('LOC-')).toBe(true);
    expect(approval.message).toContain('Locum ID');
  });

  it('should retrieve triage logs and queue surge alerts for Admin/Ops', async () => {
    // Generate an emergency redirect in triage
    await triageService.evaluate({
      patient_id: 'patient-emerg-001',
      selected_red_flags: ['DIFFICULTY_BREATHING'],
      chief_complaint: 'Severe shortness of breath and blue lips',
    });

    const triageLogs = await adminService.getTriageLogs();
    expect(triageLogs.length).toBeGreaterThanOrEqual(1);
    expect(triageLogs.some((l) => l.symptoms_flagged.includes('DIFFICULTY_BREATHING'))).toBe(true);

    const alerts = adminService.getQueueAlerts();
    expect(alerts).toBeDefined();
  });
});
