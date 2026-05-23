'use client';

import { Minus, Plus } from 'lucide-react';

import { useReveal } from '@/hooks/use-reveal';

type FaqItemProps = {
  id: string;
  q: string;
  a: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
};

export function FaqItem({ q, a, index, isOpen, onToggle }: FaqItemProps) {
  const [ref, visible] = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      data-testid={`faq-item-${index}`}
      style={{ transitionDelay: `${index * 60}ms` }}
      className={`border-border border-b transition-all duration-700 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        data-testid={`faq-toggle-${index}`}
        aria-expanded={isOpen}
        className="group flex w-full items-start gap-6 py-6 text-left lg:py-7"
      >
        <span className="num text-muted-foreground/60 text-overline pt-1.5 font-mono">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-display text-foreground group-hover:text-foreground/80 flex-1 pr-4 text-lg tracking-tight transition-colors lg:text-xl">
          {q}
        </span>
        <span className="border-border group-hover:border-foreground group-hover:text-foreground text-muted-foreground mt-1 flex h-8 w-8 shrink-0 items-center justify-center border transition-colors">
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
          isOpen ? 'max-h-faq-panel opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-muted-foreground pr-12 pb-7 pl-14 text-sm leading-relaxed lg:text-base">
          {a}
        </p>
      </div>
    </li>
  );
}
