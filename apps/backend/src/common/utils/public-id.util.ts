import * as crypto from 'crypto';
import { Role } from '@prisma/client';

/**
 * Generates standardized public identifiers:
 * PAT-XXXXXX, DOC-XXXXXX, LOC-XXXXXX, ADM-XXXXXX, PRT-XXXXXX
 */
export function generatePublicId(role: Role, isLocum = false): string {
  let prefix = 'PAT';
  if (role === Role.DOCTOR) {
    prefix = isLocum ? 'LOC' : 'DOC';
  } else if (role === Role.LOCUM) {
    prefix = 'LOC';
  } else if (role === Role.THERAPIST) {
    prefix = 'DOC';
  } else if (role === Role.ADMIN) {
    prefix = 'ADM';
  } else if (role === Role.PARTNER) {
    prefix = 'PRT';
  }

  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${randomSuffix}`;
}
