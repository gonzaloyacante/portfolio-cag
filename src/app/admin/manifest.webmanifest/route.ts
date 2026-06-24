import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Serves the admin PWA manifest.
 *
 * Route handler (not static) for the same reason as /admin/sw.js — see
 * that file's comment. Browsers fetch this without a session cookie so
 * the SW can register on the install screen.
 */
export function GET(): Response {
  const path = join(process.cwd(), 'src', 'assets', 'admin', 'manifest.webmanifest');
  const body = readFileSync(path, 'utf-8');
  return new Response(body, {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
