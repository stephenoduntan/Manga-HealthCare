import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // Populate req.user when a Bearer token is provided on public endpoints (e.g. /triage/evaluate)
      const req = context.switchToHttp().getRequest();
      if (req?.headers?.authorization?.startsWith('Bearer ')) {
        try {
          await super.canActivate(context);
        } catch {
          // Public routes still allow anonymous access if token is absent/invalid
        }
      }
      return true;
    }

    return (await super.canActivate(context)) as boolean;
  }
}
