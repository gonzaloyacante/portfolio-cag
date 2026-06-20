import { NextResponse } from 'next/server';

const PRISMA_CODE_PATTERN = /^P\d{4}\b/;
const NOT_FOUND_HINT = /not\s*found|no\s*existe|does\s*not\s*exist/i;

/**
 * Map a thrown Prisma error to a stable HTTP response.
 *
 * - P2025 (record not found) → 404
 * - P2002 (unique constraint) → 409 with offending field
 * - P2003 (FK violation) → 409
 * - any error whose message hints at a missing record → 404 (covers
 *   plain `new Error('not found')` thrown by some Prisma drivers and
 *   by tests). The original route handlers used a blanket `catch → 404`
 *   which masked real server errors as not-found; this fallback keeps
 *   the same safe behavior but logs the real cause server-side.
 * - anything else → 500 with server-side log, generic body
 *
 * Use this in every catch that wraps a Prisma mutation so the admin UI
 * sees a real reason for a failure (e.g. duplicate `code` on
 * ExperienceCard/ProcessStep) instead of a misleading 404.
 */
export function handlePrismaError(
  err: unknown,
  operation: 'create' | 'update' | 'delete' | 'reorder'
): NextResponse {
  const code =
    err && typeof err === 'object' && 'code' in err ? (err as { code?: string }).code : undefined;
  const message = err instanceof Error ? err.message : typeof err === 'string' ? err : '';

  const effectiveCode =
    code ??
    (PRISMA_CODE_PATTERN.test(message) ? message.match(PRISMA_CODE_PATTERN)![0] : undefined);

  if (effectiveCode === 'P2025' || (!effectiveCode && NOT_FOUND_HINT.test(message))) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[admin ${operation}] not-found`, err);
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (effectiveCode === 'P2002') {
    const meta =
      err && typeof err === 'object' && 'meta' in err
        ? (err as { meta?: { target?: string[] | string } }).meta
        : undefined;
    const target = Array.isArray(meta?.target) ? meta?.target.join(', ') : meta?.target;
    return NextResponse.json(
      { error: target ? `Duplicate value for ${target}` : 'Duplicate value' },
      { status: 409 }
    );
  }
  if (effectiveCode === 'P2003') {
    return NextResponse.json({ error: 'Referenced record not found' }, { status: 409 });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[admin ${operation}]`, err);
  }
  return NextResponse.json({ error: 'Internal error' }, { status: 500 });
}
