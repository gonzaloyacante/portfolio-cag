import { NextResponse } from 'next/server';

import { z } from 'zod';

import { handlePrismaError } from '@/lib/api-error';
import { withAdminAuth } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { revalidateLanding } from '@/lib/revalidate';

const reorderSchema = z.object({
  ids: z
    .array(z.string().min(1))
    .min(1)
    .max(500)
    .refine((arr) => new Set(arr).size === arr.length, 'Duplicate ids are not allowed'),
});

type UpdateableModel = {
  update: (args: { where: { id: string }; data: { order: number } }) => Promise<unknown>;
};

const SLUG_TO_MODEL: Record<string, UpdateableModel> = {
  brands: prisma.brand as unknown as UpdateableModel,
  experience: prisma.experienceCard as unknown as UpdateableModel,
  process: prisma.processStep as unknown as UpdateableModel,
  services: prisma.service as unknown as UpdateableModel,
  projects: prisma.project as unknown as UpdateableModel,
  results: prisma.resultItem as unknown as UpdateableModel,
  testimonials: prisma.testimonial as unknown as UpdateableModel,
  timeline: prisma.timelineItem as unknown as UpdateableModel,
  faqs: prisma.faqItem as unknown as UpdateableModel,
};

export const PUT = withAdminAuth(async (req, { params }) => {
  const { slug } = await params;
  const model = SLUG_TO_MODEL[slug];
  if (!model) {
    return NextResponse.json({ error: 'Unknown collection' }, { status: 404 });
  }
  const body = await req.json().catch(() => null);
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid data', issues: parsed.error.issues },
      { status: 422 }
    );
  }
  const { ids } = parsed.data;

  // Sequential updates. A `$transaction` array would also work and would
  // be atomic, but with a single-admin portfolio the race window is
  // effectively zero, so we keep sequential for simpler typing and a
  // smaller blast radius if one update fails halfway.
  try {
    for (let i = 0; i < ids.length; i += 1) {
      await model.update({ where: { id: ids[i]! }, data: { order: i } });
    }
    revalidateLanding();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handlePrismaError(err, 'reorder');
  }
});
