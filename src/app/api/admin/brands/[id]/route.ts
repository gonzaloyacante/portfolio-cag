import { NextResponse } from 'next/server';

import { handlePrismaError } from '@/lib/api-error';
import { withAdminAuth } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { revalidateLanding } from '@/lib/revalidate';
import { brandSchema } from '@/validations/admin';

export const PUT = withAdminAuth(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = brandSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid data', issues: parsed.error.issues },
      { status: 422 }
    );
  }
  try {
    const item = await prisma.brand.update({ where: { id }, data: parsed.data });
    revalidateLanding();
    return NextResponse.json(item);
  } catch (err) {
    return handlePrismaError(err, 'update');
  }
});

export const DELETE = withAdminAuth(async (_req, { params }) => {
  const { id } = await params;
  try {
    await prisma.brand.delete({ where: { id } });
    revalidateLanding();
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handlePrismaError(err, 'delete');
  }
});
