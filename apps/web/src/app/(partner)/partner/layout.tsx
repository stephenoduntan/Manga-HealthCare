'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MarketingPageShell } from '../../../components/ecosystem/EcosystemChrome';

const PUBLIC_PARTNER_ROUTES = new Set([
  '/partner',
  '/partner/features',
  '/partner/how-it-works',
  '/partner/pricing',
  '/partner/getting-started',
  '/partner/about',
  '/partner/careers',
  '/partner/contact',
]);

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname && PUBLIC_PARTNER_ROUTES.has(pathname)) {
    return <MarketingPageShell activeSurface="partner">{children}</MarketingPageShell>;
  }

  return <>{children}</>;
}
