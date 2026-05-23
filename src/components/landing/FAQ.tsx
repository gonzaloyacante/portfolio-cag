'use client';

import { useState } from 'react';

import { useReveal } from '@/hooks/use-reveal';

import { FaqItem } from './FaqItem';

type FaqEntry = {
  id: string;
  q: string;
  a: string;
};

type FAQProps = {
  overline: string;
  title: string;
  desc: string;
  items: FaqEntry[];
};

export function FAQ({ overline, title, desc, items }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(() => items[0]?.id ?? null);
  const [headerRef, headerVisible] = useReveal<HTMLDivElement>();

  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="border-border bg-background border-b py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`mb-14 grid grid-cols-1 gap-8 transition-all duration-700 lg:grid-cols-12 ${
            headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="lg:col-span-5">
            <p className="text-overline tracking-overline text-muted-foreground font-mono font-semibold uppercase">
              {overline}
            </p>
            <h2 className="font-display text-foreground mt-4 text-3xl leading-tight tracking-tight lg:text-5xl">
              {title}
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed">{desc}</p>
          </div>

          <div className="lg:col-span-7">
            <ul className="border-border border-t">
              {items.map((it, i) => (
                <FaqItem
                  key={it.id}
                  {...it}
                  index={i}
                  isOpen={openId === it.id}
                  onToggle={() => setOpenId(openId === it.id ? null : it.id)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
