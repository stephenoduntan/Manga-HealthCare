import { NextRequest, NextResponse } from 'next/server';

/**
 * MANGA HEALTHCARE Multi-Subdomain Router (Section 1 Topology)
 *
 * Maps subdomain requests transparently to role-isolated App Router groups:
 * - app.mangahealthcare.com / app.localhost      -> /patient/*
 * - doctor.mangahealthcare.com / doctor.localhost -> /doctor/*
 * - partner.mangahealthcare.com / partner.localhost -> /partner/*
 * - mangahealthcare.com/portal/*                 -> /patient/*
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostHeader = request.headers.get('host') || '';
  const hostname = (hostHeader.split(':')[0] ?? '').toLowerCase();
  const { pathname } = url;

  // Skip Next.js internals & static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Main domain `/portal` alias -> `/patient` (Sitemap Section 1)
  if (pathname === '/portal' || pathname.startsWith('/portal/')) {
    url.pathname = pathname.replace(/^\/portal/, '/patient');
    return NextResponse.rewrite(url);
  }

  // Subdomain: Patient Web App (app.mangahealthcare.com / app.localhost)
  if (hostname.startsWith('app.')) {
    if (!pathname.startsWith('/patient')) {
      if (pathname === '/') {
        url.pathname = '/patient/home';
      } else {
        url.pathname = `/patient${pathname}`;
      }
      return NextResponse.rewrite(url);
    }
  }

  // Subdomain: Doctor & Locum Portal (doctor.mangahealthcare.com / doctor.localhost)
  if (hostname.startsWith('doctor.')) {
    if (!pathname.startsWith('/doctor')) {
      if (pathname === '/') {
        url.pathname = '/doctor/dashboard';
      } else {
        url.pathname = `/doctor${pathname}`;
      }
      return NextResponse.rewrite(url);
    }
  }

  // Subdomain: Partner Fulfillment Portal (partner.mangahealthcare.com / partner.localhost)
  if (hostname.startsWith('partner.')) {
    if (!pathname.startsWith('/partner')) {
      if (pathname === '/') {
        url.pathname = '/partner/lookup';
      } else {
        url.pathname = `/partner${pathname}`;
      }
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
