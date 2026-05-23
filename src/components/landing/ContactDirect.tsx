'use client';

import { useTranslations } from 'next-intl';

import { Mail, MapPin, MessageCircle } from 'lucide-react';

import { useReveal } from '@/hooks/use-reveal';

import { ContactDirectLink } from './ContactDirectLink';

export type ContactInfo = {
  whatsappNumber: string;
  phoneDisplay: string;
  email: string;
  linkedinUrl: string;
  location: string;
  name: string;
};

type ContactDirectProps = {
  overline: string;
  title: string;
  desc: string;
  contact: ContactInfo;
};

export function ContactDirect({ overline, title, desc, contact }: ContactDirectProps) {
  const t = useTranslations('contact.direct');
  const [ref, visible] = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 lg:col-span-5 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <p className="text-overline tracking-overline text-muted-foreground font-mono font-semibold uppercase">
        {overline}
      </p>
      <h2 className="font-display text-foreground mt-4 text-3xl leading-tight tracking-tight lg:text-5xl">
        {title}
      </h2>
      <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed">{desc}</p>

      <ul className="border-border mt-10 border-t">
        <ContactDirectLink
          href={`https://wa.me/${contact.whatsappNumber}`}
          external
          testId="contact-whatsapp"
          icon={MessageCircle}
          labelTop={t('whatsapp')}
          labelBottom={contact.phoneDisplay}
        />
        <ContactDirectLink
          href={`mailto:${contact.email}`}
          testId="contact-email"
          icon={Mail}
          labelTop={t('email')}
          labelBottom={contact.email.toLowerCase()}
        />
        <ContactDirectLink
          href={contact.linkedinUrl}
          external
          testId="contact-linkedin"
          icon={MessageCircle}
          labelTop={t('linkedin')}
          labelBottom={contact.name}
        />
        <li className="border-border flex items-center gap-4 border-b px-1 py-5">
          <MapPin size={18} className="text-muted-foreground" />
          <span>
            <span className="text-muted-foreground/60 text-label tracking-label block font-mono uppercase">
              {t('location')}
            </span>
            <span className="text-foreground font-display block text-base lg:text-lg">
              {contact.location}
            </span>
          </span>
        </li>
      </ul>
    </div>
  );
}
