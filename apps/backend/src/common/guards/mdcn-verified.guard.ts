import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { REQUIRE_MDCN_VERIFIED_KEY } from '../decorators/mdcn-verified.decorator';

const CLINICIAN_ROLES = new Set<string>([Role.DOCTOR, Role.THERAPIST, Role.LOCUM]);

/**
 * Blocks clinician operational endpoints unless verification_status === 'VERIFIED'.
 */
@Injectable()
export class MdcnVerifiedGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<boolean>(REQUIRE_MDCN_VERIFIED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || user.role === Role.ADMIN) {
      return true;
    }

    if (!CLINICIAN_ROLES.has(user.role)) {
      throw new ForbiddenException('Clinician role required.');
    }

    if (user.verification_status === VerificationStatus.VERIFIED) {
      return true;
    }

    if (this.prisma.isConnected && user.id) {
      const profile = await this.prisma.doctorProfile.findUnique({
        where: { user_id: user.id },
        select: { verification_status: true },
      });
      if (profile?.verification_status === VerificationStatus.VERIFIED) {
        return true;
      }
    }

    throw new ForbiddenException(
      'MDCN credential verification must be VERIFIED before going online, claiming patients, or prescribing.',
    );
  }
}
