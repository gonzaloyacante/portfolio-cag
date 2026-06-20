import { NextResponse } from 'next/server';

import { withAdminAuth } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { revalidateLanding } from '@/lib/revalidate';
import { contactInfoUpdateSchema } from '@/validations/admin';

export const GET = withAdminAuth(async () => {
  const contactInfo = await prisma.contactInfo.findFirst();
  if (!contactInfo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(contactInfo);
});

export const PUT = withAdminAuth(async (req) => {
  const body = await req.json().catch(() => null);
  const parsed = contactInfoUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid data', issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const existing = await prisma.contactInfo.findFirst();
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Most ContactInfo columns are non-nullable in Prisma. A `null` from
  // the client means "clear this field", which we model as an empty
  // string for non-nullable columns. Only `linkedinUrl` is nullable.
  const { linkedinUrl, ...rest } = parsed.data;
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value === undefined) continue;
    data[key] = value === null ? '' : value;
  }
  if (linkedinUrl !== undefined) {
    data.linkedinUrl = linkedinUrl === '' ? null : linkedinUrl;
  }

  const updated = await prisma.contactInfo.update({
    where: { id: existing.id },
    data,
  });
  revalidateLanding();
  return NextResponse.json(updated);
});
