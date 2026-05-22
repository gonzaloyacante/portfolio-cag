import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  const [
    hero,
    contactInfo,
    brands,
    experience,
    process,
    services,
    projects,
    results,
    testimonials,
    timeline,
    faqs,
    sectionsArr,
  ] = await Promise.all([
    prisma.hero.findFirst({ include: { stats: { orderBy: { order: 'asc' } } } }),
    prisma.contactInfo.findFirst(),
    prisma.brand.findMany({ orderBy: { order: 'asc' } }),
    prisma.experienceCard.findMany({ orderBy: { order: 'asc' } }),
    prisma.processStep.findMany({ orderBy: { order: 'asc' } }),
    prisma.service.findMany({ orderBy: { order: 'asc' } }),
    prisma.project.findMany({ orderBy: { order: 'asc' } }),
    prisma.resultItem.findMany({ orderBy: { order: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { order: 'asc' } }),
    prisma.timelineItem.findMany({ orderBy: { order: 'asc' } }),
    prisma.faqItem.findMany({ orderBy: { order: 'asc' } }),
    prisma.sectionMeta.findMany(),
  ]);

  const sections = Object.fromEntries(sectionsArr.map((s) => [s.slug, s]));

  return NextResponse.json({
    hero,
    contactInfo,
    brands,
    experience,
    process,
    services,
    projects,
    results,
    testimonials,
    timeline,
    faqs,
    sections,
  });
}
