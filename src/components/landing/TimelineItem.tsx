'use client';

import { useReveal } from '@/hooks/use-reveal';

type TimelineItemProps = {
  id: string;
  period: string;
  title: string;
  body: string;
  index: number;
};

export function TimelineItem({ period, title, body, index }: TimelineItemProps) {
  const [ref, visible] = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      data-testid={`timeline-item-${index}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`relative pb-12 pl-10 transition-all duration-700 last:pb-0 lg:pl-14 ${
        visible ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
      }`}
    >
      <span
        className={`border-border bg-background absolute top-1 left-0 h-4 w-4 -translate-x-1/2 border-2 transition-colors duration-500 ${
          visible ? 'border-foreground' : ''
        }`}
      />
      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <div className="num font-display text-foreground text-2xl tracking-tight lg:text-3xl">
            {period}
          </div>
        </div>
        <div className="lg:col-span-9">
          <h3 className="font-display text-foreground text-xl tracking-tight lg:text-2xl">
            {title}
          </h3>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed lg:text-base">
            {body}
          </p>
        </div>
      </div>
    </li>
  );
}
