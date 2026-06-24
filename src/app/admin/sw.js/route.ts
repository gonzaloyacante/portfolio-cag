import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Serves the admin PWA service worker.
 *
 * Implemented as a route handler (not as a static file in /public) because
 * Next.js App Router's `/admin/*` route group would otherwise intercept the
 * static file and redirect unauthenticated requests to /admin/login — which
 * silently breaks SW install. The middleware matcher also excludes this
 * path so the SW can be fetched without a session cookie.
 *
 * Headers:
 *   - application/javascript: required by the SW spec; without it, the
 *     browser rejects the registration with a MIME type error.
 *   - no-store: SW files must never be cached — every fetch must hit the
 *     server so updates roll out immediately.
 *   - Service-Worker-Allowed: /admin/ — explicit scope declaration. With
 *     the SW at /admin/sw.js the default scope is already /admin/, but we
 *     set it explicitly so future moves don't silently widen the scope.
 */
export function GET(): Response {
  const path = join(process.cwd(), 'src', 'assets', 'admin', 'sw.js');
  const body = readFileSync(path, 'utf-8');
  return new Response(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Service-Worker-Allowed': '/admin/',
    },
  });
}
