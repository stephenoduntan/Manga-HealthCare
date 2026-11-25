import { SetMetadata } from '@nestjs/common';

export const REQUIRE_MDCN_VERIFIED_KEY = 'require_mdcn_verified';

/**
 * Marks a clinician endpoint as requiring VERIFIED MDCN verification_status.
 */
export const RequireMdcnVerified = () => SetMetadata(REQUIRE_MDCN_VERIFIED_KEY, true);
