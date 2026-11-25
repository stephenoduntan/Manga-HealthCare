import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { REQUIRE_NDPR_CONSENT_KEY } from '../decorators/ndpr-consent.decorator';

/**
 * Blocks PATIENT endpoints unless telemedicine_consent === true and ndpr_consent === true.
 */
@Injectable()
export class NdprConsentGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<boolean>(REQUIRE_NDPR_CONSENT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Authentication required for consented patient operations.');
    }

    if (user.role !== Role.PATIENT) {
      return true;
    }

    if (user.telemedicine_consent === true && user.ndpr_consent === true) {
      return true;
    }

    if (this.prisma.isConnected && user.id) {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { telemedicine_consent: true, ndpr_consent: true },
      });
      if (dbUser?.telemedicine_consent && dbUser?.ndpr_consent) {
        return true;
      }
    }

    throw new ForbiddenException(
      'NDPR and Telemedicine consent must be accepted before accessing bookings or consultations.',
    );
  }
}
