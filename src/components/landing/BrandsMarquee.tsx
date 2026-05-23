'use client';

import { useTranslations } from 'next-intl';

import { Marquee } from '@/components/ui/marquee';

type Brand = { id: string; name: string };

export function BrandsMarquee({ brands }: { brands: Brand[] }) {
  const t = useTranslations('brands');

  const loop = brands.length
    ? [
        ...brands.map((b) => ({ ...b, _k: `${b.id}-a` })),
        ...brands.map((b) => ({ ...b, _k: `${b.id}-b` })),
      ]
    : [];

  return (
    <section
      id="brands"
      data-testid="brands-section"
      className="border-border bg-background relative border-y"
    >
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-6 lg:px-8 lg:pt-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-overline tracking-overline text-muted-foreground font-mono font-semibold uppercase">
              {t('overline')}
            </p>
            <h2 className="font-display text-foreground mt-3 max-w-2xl text-2xl tracking-tight lg:text-4xl">
              {t('title')}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed lg:max-w-md">{t('desc')}</p>
        </div>
      </div>

      <div className="border-border border-t">
        <Marquee className="py-7">
          {loop.map((brand, i) => (
            <span
              key={brand._k}
              data-testid={`brand-item-${i}`}
              className="font-display text-muted-foreground tracking-display flex items-center text-2xl whitespace-nowrap uppercase lg:text-3xl"
            >
              <span className="px-10">{brand.name}</span>
              <span className="text-border">●</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="border-border border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <span className="text-label tracking-label text-muted-foreground font-mono uppercase">
            {brands.length} SISTEMAS · {brands.length} SYSTEMS
          </span>
          <span className="text-label tracking-label text-muted-foreground font-mono uppercase">
            HANDS-ON · ON-SITE
          </span>
        </div>
      </div>
    </section>
  );
}
