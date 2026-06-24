import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Serves the 512x512 PWA icon. See /admin/sw.js for the routing rationale. */
export function GET(): Response {
  const path = join(process.cwd(), 'src', 'assets', 'admin', 'icon-512.png');
  const body = readFileSync(path);
  return new Response(new Uint8Array(body), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
