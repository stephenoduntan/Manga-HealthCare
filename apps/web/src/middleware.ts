import { NextRequest, NextResponse } from 'next/server';

/**
 * MANGA HEALTHCARE Multi-Subdomain Ecosystem Router
 *
 * Maps subdomain requests transparently to role-isolated App Router groups:
 * - app.mangahealthcare.com / app.localhost         -> /patient/*
 * - doctor.mangahealthcare.com / doctor.localhost   -> /doctor/*
 * - partner.mangahealthcare.com / partner.localhost -> /partner/*
 * - help.mangahealthcare.com / help.localhost       -> /help/*
 * - blog.mangahealthcare.com / blog.localhost       -> /blog/*
 * - legal.mangahealthcare.com / legal.localhost     -> /legal/*
 * - mangahealthcare.com/portal/*                    -> /patient/*
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostHeader = request.headers.get('host') || '';
  const hostname = (hostHeader.split(':')[0] ?? '').toLowerCase();
  const { pathname } = url;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Main domain `/portal` alias -> `/patient`
  if (pathname === '/portal' || pathname.startsWith('/portal/')) {
    url.pathname = pathname.replace(/^\/portal/, '/patient');
    return NextResponse.rewrite(url);
  }

  const subdomainPrefixMap: Array<{ prefix: string; target: string; rootTarget: string }> = [
    { prefix: 'app.', target: '/patient', rootTarget: '/patient/home' },
    { prefix: 'doctor.', target: '/doctor', rootTarget: '/doctor' },
    { prefix: 'partner.', target: '/partner', rootTarget: '/partner' },
    { prefix: 'help.', target: '/help', rootTarget: '/help' },
    { prefix: 'blog.', target: '/blog', rootTarget: '/blog' },
    { prefix: 'legal.', target: '/legal', rootTarget: '/legal' },
  ];

  for (const rule of subdomainPrefixMap) {
    if (hostname.startsWith(rule.prefix)) {
      if (!pathname.startsWith(rule.target)) {
        url.pathname = pathname === '/' ? rule.rootTarget : `${rule.target}${pathname}`;
        return NextResponse.rewrite(url);
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
