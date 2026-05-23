'use client';

import { useReveal } from '@/hooks/use-reveal';

import { TimelineItem } from './TimelineItem';

type TimelineMilestone = {
  id: string;
  period: string;
  title: string;
  body: string;
};

type TimelineProps = {
  overline: string;
  title: string;
  desc: string;
  items: TimelineMilestone[];
};

export function Timeline({ overline, title, desc, items }: TimelineProps) {
  const [headerRef, headerVisible] = useReveal<HTMLDivElement>();
  return (
    <section
      id="timeline"
      data-testid="timeline-section"
      className="border-border relative border-b py-24 lg:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`mb-16 grid grid-cols-1 gap-8 transition-all duration-700 lg:grid-cols-12 ${
            headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="lg:col-span-7">
            <p className="text-overline tracking-overline text-muted-foreground font-mono font-semibold uppercase">
              {overline}
            </p>
            <h2 className="font-display text-foreground mt-4 text-3xl leading-tight tracking-tight lg:text-5xl">
              {title}
            </h2>
          </div>
          <div className="flex lg:col-span-5 lg:items-end">
            <p className="text-muted-foreground text-base leading-relaxed lg:text-lg">{desc}</p>
          </div>
        </div>

        <ol className="border-border ml-2 border-l-2 lg:ml-4">
          {items.map((m, i) => (
            <TimelineItem key={m.id} {...m} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
