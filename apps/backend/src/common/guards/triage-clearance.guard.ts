import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { TriageService } from '../../triage/triage.service';

/**
 * Enforces mandatory triage clearance token presence and validity before booking creation.
 */
@Injectable()
export class TriageClearanceGuard implements CanActivate {
  constructor(private readonly triageService: TriageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      request?.body?.triage_clearance_token ||
      request?.headers?.['x-triage-clearance-token'];

    if (!token || typeof token !== 'string') {
      throw new ForbiddenException(
        'Mandatory emergency triage clearance token is required before creating a booking.',
      );
    }

    this.triageService.validateClearanceToken(token);
    return true;
  }
}
