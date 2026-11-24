import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin / Ops Command Center Subdomain & Path Alias Middleware
 * Supports both root paths (/, /auth, /live-ops, /verifications, /compliance, /analytics)
 * and Sitemap Section 5 `/admin/*` paths (/admin/auth, /admin/live-ops, /admin/verifications, etc.).
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const routeMap: Record<string, string> = {
    '/admin': '/',
    '/admin/live-ops': '/',
    '/live-ops': '/',
    '/admin/verifications': '/doctors',
    '/verifications': '/doctors',
    '/admin/compliance': '/redirects',
    '/compliance': '/redirects',
    '/admin/disputes': '/disputes',
    '/admin/analytics': '/analytics',
    '/admin/auth': '/auth',
  };

  if (routeMap[pathname]) {
    url.pathname = routeMap[pathname];
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
