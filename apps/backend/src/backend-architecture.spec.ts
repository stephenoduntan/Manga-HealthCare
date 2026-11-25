import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Role, VerificationStatus } from '@prisma/client';
import { AuthService } from './auth/auth.service';
import { RedisService } from './common/redis/redis.service';
import { PrismaService } from './common/prisma/prisma.service';
import { NdprConsentGuard } from './common/guards/ndpr-consent.guard';
import { MdcnVerifiedGuard } from './common/guards/mdcn-verified.guard';
import { PaystackAdapter } from './integrations/paystack.adapter';
import { FlutterwaveAdapter } from './integrations/flutterwave.adapter';
import { ObservabilityAdapter } from './integrations/observability.adapter';
import { PartnersService } from './partners/partners.service';
import { AdminService } from './admin/admin.service';
import { TriageService } from './triage/triage.service';
import { QueueService } from './bookings/queue.service';

describe('Backend Architecture Guards, Integrations, Auth Refresh & Partner Fulfillment', () => {
  let authService: AuthService;
  let partnersService: PartnersService;
  let adminService: AdminService;
  let paystackAdapter: PaystackAdapter;
  let observability: ObservabilityAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ secret: 'arch-test-secret', signOptions: { expiresIn: '15m' } }),
      ],
      providers: [
        AuthService,
        PartnersService,
        AdminService,
        TriageService,
        QueueService,
        RedisService,
        PaystackAdapter,
        FlutterwaveAdapter,
        ObservabilityAdapter,
        { provide: PrismaService, useValue: { isConnected: false } },
      ],
    }).compile();

    authService = module.get(AuthService);
    partnersService = module.get(PartnersService);
    adminService = module.get(AdminService);
    paystackAdapter = module.get(PaystackAdapter);
    observability = module.get(ObservabilityAdapter);
    await module.get(RedisService).onModuleInit();
  });

  it('should rotate refresh tokens and invalidate on logout', async () => {
    const otp = await authService.requestOtp({ identifier: '+2348011112222' });
    const login = await authService.verifyOtp({
      identifier: '+2348011112222',
      otp: otp.dev_otp!,
      role: Role.PATIENT,
    });

    expect(login.refresh_token).toBeDefined();
    const rotated = await authService.refreshAccessToken(login.refresh_token);
    expect(rotated.access_token).toBeDefined();
    expect(rotated.refresh_token).not.toBe(login.refresh_token);

    await authService.logout(rotated.refresh_token);
    await expect(authService.refreshAccessToken(rotated.refresh_token)).rejects.toThrow();
  });

  it('NdprConsentGuard should block unconsented PATIENT requests', async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(true) } as unknown as Reflector;
    const guard = new NdprConsentGuard(reflector, { isConnected: false } as PrismaService);
    const ctx = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'p1', role: Role.PATIENT, telemedicine_consent: false, ndpr_consent: false },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('MdcnVerifiedGuard should block unverified clinicians', async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(true) } as unknown as Reflector;
    const guard = new MdcnVerifiedGuard(reflector, { isConnected: false } as PrismaService);
    const ctx = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'd1', role: Role.DOCTOR, verification_status: VerificationStatus.PENDING },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('PartnersService.fulfillPrescription should prevent duplicate dispensing', async () => {
    const rxId = 'rx-fulfill-001';
    const first = await partnersService.fulfillPrescription(rxId, 'partner-001');
    expect(first.success).toBe(true);
    await expect(partnersService.fulfillPrescription(rxId, 'partner-001')).rejects.toThrow();
  });

  it('AdminService.dispatchUrgentLocum should generate LOC-XXXX public ID', async () => {
    const res = await adminService.dispatchUrgentLocum(
      {
        name: 'Dr. Urgent Locum',
        phone: '+2348055556666',
        mdcn_license_number: 'MDCN-90909',
      },
      'admin-001',
    );
    expect(res.success).toBe(true);
    expect(res.locum_public_id.startsWith('LOC-')).toBe(true);
  });

  it('ObservabilityAdapter.scrubPhi should redact sensitive patient fields', () => {
    const scrubbed = observability.scrubPhi({
      booking_id: 'bkg-1',
      allergies: ['Penicillin'],
      phone: '+2348000000000',
    }) as Record<string, unknown>;

    expect(scrubbed.booking_id).toBe('bkg-1');
    expect(scrubbed.allergies).toBe('[REDACTED_PHI]');
    expect(scrubbed.phone).toBe('[REDACTED_PHI]');
  });

  it('PaystackAdapter should initialize checkout fallback cleanly without live secrets', async () => {
    const res = await paystackAdapter.initializeTransaction({
      email: 'test@mangahealthcare.com',
      amountNaira: 10000,
      reference: 'ref_001',
    });
    expect(res.authorization_url).toContain('ref_001');
  });
});
