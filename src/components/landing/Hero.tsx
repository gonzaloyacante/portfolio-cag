'use client';

import { useTranslations } from 'next-intl';

import { HeroCtas } from './HeroCtas';
import { HeroPortrait } from './HeroPortrait';
import { HeroStats } from './HeroStats';

type HeroStat = { id: string; value: string; label: string };

type HeroProps = {
  overline: string;
  headline: string;
  summary: string;
  ctaWhatsapp: string;
  ctaEmail: string;
  ctaLinkedin: string;
  stats: HeroStat[];
  whatsappNumber: string;
  email: string;
  linkedin: string;
  portraitUrl?: string;
};

export function Hero({
  overline,
  headline,
  summary,
  ctaWhatsapp,
  ctaEmail,
  ctaLinkedin,
  stats,
  whatsappNumber,
  email,
  linkedin,
  portraitUrl,
}: HeroProps) {
  const t = useTranslations('hero');

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative overflow-hidden pt-28 pb-20 lg:pt-32 lg:pb-28"
    >
      <div aria-hidden className="tech-grain absolute inset-0" />
      <div
        aria-hidden
        className="from-background/40 to-background absolute inset-0 bg-gradient-to-b via-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="border-border mb-12 flex items-center justify-between border-y py-3 lg:mb-16">
          <span className="text-label tracking-label text-muted-foreground font-mono uppercase">
            {t('tag_id')}
          </span>
          <span className="text-label tracking-label text-muted-foreground font-mono uppercase">
            {t('tag_location')}
          </span>
          <span className="text-label tracking-label text-muted-foreground hidden font-mono uppercase sm:inline">
            {t('tag_est')}
          </span>
        </div>

        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="animate-fade-up lg:col-span-8">
            <p
              data-testid="hero-overline"
              className="text-overline tracking-overline text-muted-foreground tick mb-8 font-mono font-semibold uppercase"
            >
              {overline}
            </p>

            <h1
              data-testid="hero-name"
              className="font-display text-foreground text-display-sm xl:text-display-xl leading-hero font-medium tracking-tight uppercase sm:text-6xl lg:text-7xl"
            >
              Carlos
              <br />
              Armando
              <br />
              <span className="text-muted-foreground">Guerra.</span>
            </h1>

            <h2
              data-testid="hero-headline"
              className="font-display text-foreground mt-10 max-w-2xl text-xl leading-snug sm:text-2xl lg:text-3xl"
            >
              {headline}
            </h2>

            <p
              data-testid="hero-summary"
              className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed lg:text-lg"
            >
              {summary}
            </p>

            <HeroCtas
              whatsappNumber={whatsappNumber}
              email={email}
              linkedin={linkedin}
              labelWhatsapp={ctaWhatsapp}
              labelEmail={ctaEmail}
              labelLinkedin={ctaLinkedin}
            />
          </div>

          {portraitUrl && (
            <div className="lg:col-span-4">
              <HeroPortrait
                src={portraitUrl}
                alt="Carlos Armando Guerra"
                figLabel={t('fig_label')}
                name={t('portrait_name')}
                origin={t('portrait_origin')}
              />
            </div>
          )}
        </div>

        <HeroStats stats={stats} />
      </div>
    </section>
  );
}
