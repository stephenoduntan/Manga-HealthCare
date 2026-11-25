import { SetMetadata } from '@nestjs/common';

export const AUDIT_TARGET_KEY = 'audit_target';

/**
 * Annotates an endpoint with explicit NDPR audit target metadata.
 */
export const AuditTarget = (targetType: string) => SetMetadata(AUDIT_TARGET_KEY, targetType);
