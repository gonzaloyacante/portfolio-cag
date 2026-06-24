import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest): Response {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    // Pre-auth flows that must work without a session cookie.
    // The session cookie is only required for routes inside the
    // (protected) group (admin shell), enforced by the layout guard.
    if (
      pathname === '/admin/login' ||
      pathname === '/admin/forgot-password' ||
      pathname === '/admin/reset-password'
    ) {
      return NextResponse.next();
    }
    // PWA assets (service worker, manifest, icons) must be reachable
    // WITHOUT a session. The browser fetches the SW in the background
    // and never sends cookies for that request — if we redirected it to
    // /admin/login, the SW install would fail silently and the admin
    // would never receive push notifications.
    if (
      pathname === '/admin/sw.js' ||
      pathname === '/admin/manifest.webmanifest' ||
      pathname === '/admin/icon-192.png' ||
      pathname === '/admin/icon-512.png' ||
      pathname === '/admin/apple-touch-icon.png'
    ) {
      return NextResponse.next();
    }
    const sessionCookie =
      request.cookies.get('better-auth.session_token') ??
      request.cookies.get('__Secure-better-auth.session_token');
    if (sessionCookie === undefined) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(en|es)/:path*',
    // Exclude PWA assets from the matcher so the middleware never even
    // runs for them — they're served by route handlers (app/admin/sw.js,
    // etc.) and must always be reachable, no session required.
    '/admin/((?!sw\\.js|manifest\\.webmanifest|icon-192\\.png|icon-512\\.png|apple-touch-icon\\.png).*)',
    '/admin',
  ],
};
