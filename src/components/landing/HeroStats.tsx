'use client';

import type { ReactNode } from 'react';

import { useCountUp } from '@/hooks/use-count-up';

type HeroStat = { id: string; value: string; label: string };

function parseStat(value: string): { num: number; suffix: string } | { num: null; raw: string } {
  const match = value.match(/^(\d+)([^\d]*)$/);
  if (match) return { num: parseInt(match[1], 10), suffix: match[2] ?? '' };
  return { num: null, raw: value };
}

export function HeroStats({ stats }: { stats: HeroStat[] }) {
  const slots = Array.from(
    { length: 4 },
    (_, i) => stats[i] ?? { id: `empty-${i}`, value: '', label: '' }
  );
  return (
    <div className="border-border mt-16 grid grid-cols-2 border-t lg:mt-24 lg:grid-cols-4">
      {slots.map((s, i) => {
        const parsed = parseStat(s.value);
        return parsed.num != null ? (
          <AnimatedStat
            key={s.id}
            index={i}
            label={s.label}
            target={parsed.num}
            suffix={parsed.suffix}
          />
        ) : (
          <StaticStat key={s.id} index={i} label={s.label} value={parsed.raw} />
        );
      })}
    </div>
  );
}

function StatShell({
  index,
  label,
  children,
}: {
  index: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      data-testid={`hero-stat-${index}`}
      className={`border-border border-b px-5 py-8 lg:py-10 ${index % 2 === 0 ? 'border-r' : ''} lg:border-r ${index === 3 ? 'lg:border-r-0' : ''}`}
    >
      {children}
      <div className="text-label tracking-overline text-muted-foreground mt-3 font-mono leading-snug uppercase">
        {label}
      </div>
    </div>
  );
}

function AnimatedStat({
  index,
  label,
  target,
  suffix,
}: {
  index: number;
  label: string;
  target: number;
  suffix: string;
}) {
  const [ref, value] = useCountUp(target, { suffix });
  return (
    <StatShell index={index} label={label}>
      <div
        ref={ref}
        className="num text-foreground text-3xl font-medium tracking-tight lg:text-5xl"
      >
        {value}
      </div>
    </StatShell>
  );
}

function StaticStat({ index, label, value }: { index: number; label: string; value: string }) {
  return (
    <StatShell index={index} label={label}>
      <div className="num text-foreground text-3xl font-medium tracking-tight lg:text-5xl">
        {value}
      </div>
    </StatShell>
  );
}
