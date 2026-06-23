import { NextResponse } from 'next/server';

import { withAdminAuth } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { revalidateLanding } from '@/lib/revalidate';
import { seoConfigUpdateSchema } from '@/validations/admin';

export const GET = withAdminAuth(async (_req, { params }) => {
  const { slug } = await params;
  const config = await prisma.seoConfig.findUnique({ where: { slug } });
  if (!config) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(config);
});

export const PUT = withAdminAuth(async (req, { params }) => {
  const { slug } = await params;
  const body = await req.json().catch(() => null);
  const parsed = seoConfigUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid data', issues: parsed.error.issues },
      { status: 422 }
    );
  }
  const existing = await prisma.seoConfig.findUnique({ where: { slug } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value === undefined) continue;
    if (key === 'ogImage') {
      // already transformed by the schema (null if empty string)
      data[key] = value;
    } else if (typeof value === 'string') {
      // null/empty string normalize: store as null for nullable text columns
      data[key] = value === '' ? null : value;
    } else {
      data[key] = value;
    }
  }

  const updated = await prisma.seoConfig.update({ where: { slug }, data });
  revalidateLanding();
  return NextResponse.json(updated);
});

export const DELETE = withAdminAuth(async (_req, { params }) => {
  const { slug } = await params;
  const existing = await prisma.seoConfig.findUnique({ where: { slug } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.seoConfig.delete({ where: { slug } });
  revalidateLanding();
  return NextResponse.json({ success: true });
});
