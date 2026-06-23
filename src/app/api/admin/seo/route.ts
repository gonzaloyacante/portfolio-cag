import { NextResponse } from 'next/server';

import { z } from 'zod';

import { withAdminAuth } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

const createSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/, 'slug debe ser kebab-case'),
});

export const GET = withAdminAuth(async () => {
  const configs = await prisma.seoConfig.findMany({ orderBy: { slug: 'asc' } });
  return NextResponse.json(configs);
});

export const POST = withAdminAuth(async (req) => {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid slug', issues: parsed.error.issues },
      { status: 422 }
    );
  }
  const { slug } = parsed.data;
  const existing = await prisma.seoConfig.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
  }
  const created = await prisma.seoConfig.create({ data: { slug } });
  return NextResponse.json(created, { status: 201 });
});
