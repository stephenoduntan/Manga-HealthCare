import { SetMetadata } from '@nestjs/common';

export const REQUIRE_NDPR_CONSENT_KEY = 'require_ndpr_consent';

/**
 * Marks a route as requiring explicit Telemedicine & NDPR patient consent.
 */
export const RequireConsent = () => SetMetadata(REQUIRE_NDPR_CONSENT_KEY, true);
