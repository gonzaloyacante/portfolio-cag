'use client';

import { LangSwitch } from '@/components/ui/lang-switch';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  locales: readonly string[];
  currentLocale: string;
  onLocaleSwitch: (locale: string) => void;
  langLabel: string;
};

export function MobileMenu({
  open,
  onClose,
  links,
  locales,
  currentLocale,
  onLocaleSwitch,
  langLabel,
}: MobileMenuProps) {
  return (
    <div
      className={`border-border bg-background overflow-hidden border-t transition-[max-height,opacity] duration-300 ease-out lg:hidden ${
        open ? 'max-h-mobile-menu opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6">
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={onClose}
            data-testid={`mnav-${l.href.replace('#', '')}`}
            style={{ transitionDelay: `${i * 40}ms` }}
            className={`text-foreground/80 hover:text-foreground border-border border-b pb-3 text-base font-medium transition-all duration-300 ${
              open ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
            }`}
          >
            {l.label}
          </a>
        ))}
        <LangSwitch
          locales={locales}
          current={currentLocale}
          onSwitch={onLocaleSwitch}
          label={langLabel}
          className="mt-2 self-start"
        />
      </div>
    </div>
  );
}
