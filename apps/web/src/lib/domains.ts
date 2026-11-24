/**
 * Centralized Multi-Subdomain & Route Resolution Helper
 * Matches MANGA HEALTHCARE Multi-Subdomain Architecture & Application Sitemap Section 1.
 * Deterministic on both SSR and Client (zero hydration drift).
 */

export type PortalSurface = 'marketing' | 'patient' | 'doctor' | 'admin' | 'partner';

const USE_SUBDOMAINS = process.env.NEXT_PUBLIC_USE_SUBDOMAINS === 'true';

const SUBDOMAIN_ORIGINS: Record<PortalSurface, string> = {
  marketing: process.env.NEXT_PUBLIC_MARKETING_ORIGIN || 'https://mangahealthcare.com',
  patient: process.env.NEXT_PUBLIC_PATIENT_ORIGIN || 'https://app.mangahealthcare.com',
  doctor: process.env.NEXT_PUBLIC_DOCTOR_ORIGIN || 'https://doctor.mangahealthcare.com',
  admin: process.env.NEXT_PUBLIC_ADMIN_ORIGIN || 'http://localhost:3001',
  partner: process.env.NEXT_PUBLIC_PARTNER_ORIGIN || 'https://partner.mangahealthcare.com',
};

const PATH_PREFIXES: Record<PortalSurface, string> = {
  marketing: '',
  patient: '/patient',
  doctor: '/doctor',
  admin: '',
  partner: '/partner',
};

/**
 * Resolves a portal path to either a subdomain URL (when NEXT_PUBLIC_USE_SUBDOMAINS=true)
 * or a unified workspace path for seamless local / single-origin preview.
 */
export function getPortalUrl(portal: PortalSurface, subPath = '/'): string {
  const normalizedSub = subPath.startsWith('/') ? subPath : `/${subPath}`;

  if (portal === 'admin') {
    const adminOrigin =
      process.env.NEXT_PUBLIC_ADMIN_ORIGIN ||
      (USE_SUBDOMAINS ? 'https://admin.mangahealthcare.com' : 'http://localhost:3001');
    return `${adminOrigin}${normalizedSub === '/' ? '' : normalizedSub}`;
  }

  if (USE_SUBDOMAINS) {
    return `${SUBDOMAIN_ORIGINS[portal]}${normalizedSub === '/' ? '' : normalizedSub}`;
  }

  const prefix = PATH_PREFIXES[portal];
  if (normalizedSub === '/') {
    return prefix || '/';
  }
  return `${prefix}${normalizedSub}`;
}
