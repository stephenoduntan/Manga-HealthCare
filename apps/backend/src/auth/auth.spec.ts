import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RedisService } from '../common/redis/redis.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { Role } from '@prisma/client';

describe('AuthService (Auth, OTP & Onboarding Module)', () => {
  let service: AuthService;
  let redis: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
          secret: 'test-auth-jwt-secret-2026',
          signOptions: { expiresIn: '24h' },
        }),
      ],
      providers: [
        AuthService,
        RedisService,
        {
          provide: PrismaService,
          useValue: {
            isConnected: false,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    redis = module.get<RedisService>(RedisService);
    await redis.onModuleInit();
  });

  it('should request OTP for a phone number and allow verification with the issued OTP', async () => {
    const phone = '+2348012345678';
    const otpRes = await service.requestOtp({ identifier: phone });

    expect(otpRes.success).toBe(true);
    expect(otpRes.dev_otp).toBeDefined();

    const verifyRes = await service.verifyOtp({
      identifier: phone,
      otp: otpRes.dev_otp!,
      name: 'John Doe',
      role: Role.PATIENT,
    });

    expect(verifyRes.access_token).toBeDefined();
    expect(verifyRes.user.phone).toBe(phone);
    expect(verifyRes.user.role).toBe(Role.PATIENT);
    expect(verifyRes.user.public_id.startsWith('PAT-')).toBe(true);
  });

  it('should support Email + OTP onboarding and issue PAT-XXXX public id', async () => {
    const email = 'patient@mangahealthcare.ng';
    const otpRes = await service.requestOtp({ identifier: email });

    const verifyRes = await service.verifyOtp({
      identifier: email,
      otp: otpRes.dev_otp!,
      name: 'Amaka Okafor',
      role: Role.PATIENT,
    });

    expect(verifyRes.access_token).toBeDefined();
    expect(verifyRes.user.email).toBe(email);
    expect(verifyRes.user.public_id.startsWith('PAT-')).toBe(true);
  });

  it('should support Doctor/Locum ID + OTP login and issue LOC-XXXX or DOC-XXXX', async () => {
    // Locum doctor signup
    const locumPhone = '+2348099887766';
    const otpRes = await service.requestOtp({ identifier: locumPhone });

    const verifyRes = await service.verifyOtp({
      identifier: locumPhone,
      otp: otpRes.dev_otp!,
      name: 'Dr. Tunde Bakare',
      role: Role.LOCUM,
      is_locum: true,
      mdcn_license_number: 'MDCN-12345',
      specialty: 'Emergency Medicine',
    });

    expect(verifyRes.access_token).toBeDefined();
    expect(verifyRes.user.role).toBe(Role.LOCUM);
    expect(verifyRes.user.public_id.startsWith('LOC-')).toBe(true);
  });

  it('should update Telemedicine + NDPR Consent', async () => {
    const phone = '+2348112233445';
    const otpRes = await service.requestOtp({ identifier: phone });
    const verifyRes = await service.verifyOtp({
      identifier: phone,
      otp: otpRes.dev_otp!,
      name: 'Consent Tester',
      role: Role.PATIENT,
    });

    const consentRes = await service.updateConsent(verifyRes.user.id, {
      telemedicine_consent: true,
      ndpr_consent: true,
    });

    expect(consentRes.telemedicine_consent).toBe(true);
    expect(consentRes.ndpr_consent).toBe(true);
  });
});
