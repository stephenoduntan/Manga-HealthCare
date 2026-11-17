import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  public_id: string;
  role: string;
  name: string;
  phone: string;
  email?: string;
  telemedicine_consent: boolean;
  ndpr_consent: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'manga-healthcare-jwt-secret-key-2026',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid or expired authentication token');
    }

    if (this.prisma.isConnected) {
      try {
        const user = await this.prisma.user.findUnique({
          where: { id: payload.sub },
          include: {
            doctor_profile: true,
            patient_profile: true,
          },
        });
        if (user) {
          return {
            id: user.id,
            public_id: user.public_id,
            role: user.role,
            name: user.name,
            phone: user.phone,
            email: user.email,
            telemedicine_consent: user.telemedicine_consent,
            ndpr_consent: user.ndpr_consent,
            is_locum: user.doctor_profile?.is_locum ?? (user.role === 'LOCUM'),
          };
        }
      } catch {
        // Fall back to decoded payload if DB is temporarily unreachable
      }
    }

    return {
      id: payload.sub,
      public_id: payload.public_id,
      role: payload.role,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      telemedicine_consent: payload.telemedicine_consent,
      ndpr_consent: payload.ndpr_consent,
      is_locum: payload.role === 'LOCUM',
    };
  }
}
