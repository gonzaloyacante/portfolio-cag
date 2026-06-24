import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Serves the 192x192 PWA icon.
 * Route handler (see /admin/sw.js for the rationale on why these are not
 * served from /public directly under App Router).
 */
export function GET(): Response {
  const path = join(process.cwd(), 'src', 'assets', 'admin', 'icon-192.png');
  const body = readFileSync(path);
  return new Response(new Uint8Array(body), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
