'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { MessageCircle } from 'lucide-react';

type StickyWhatsAppProps = {
  whatsappNumber: string;
};

export function StickyWhatsApp({ whatsappNumber }: StickyWhatsAppProps) {
  const t = useTranslations('a11y');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="sticky-whatsapp"
      aria-label={t('whatsapp_sticky')}
      className={`group border-border bg-foreground text-background shadow-foreground/20 fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 border py-3 pr-4 pl-3 text-sm font-semibold shadow-lg transition-all duration-300 ${
        show
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <span className="bg-background text-foreground -ml-1 flex h-7 w-7 items-center justify-center">
        <MessageCircle size={14} strokeWidth={2.4} />
      </span>
      <span className="hidden sm:inline">WhatsApp</span>
      <span className="sm:hidden">Chat</span>
    </a>
  );
}
