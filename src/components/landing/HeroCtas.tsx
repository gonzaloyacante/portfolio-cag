import { ArrowDownRight, ExternalLink, Mail, MessageCircle } from 'lucide-react';

type HeroCtasProps = {
  whatsappNumber: string;
  email: string;
  linkedin: string;
  labelWhatsapp: string;
  labelEmail: string;
  labelLinkedin: string;
};

export function HeroCtas({
  whatsappNumber,
  email,
  linkedin,
  labelWhatsapp,
  labelEmail,
  labelLinkedin,
}: HeroCtasProps) {
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="hero-cta-whatsapp"
        className="group bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-3 px-6 py-4 text-sm font-semibold tracking-wide transition-all active:scale-[0.98]"
      >
        <MessageCircle size={18} strokeWidth={2.2} />
        {labelWhatsapp}
        <ArrowDownRight
          size={16}
          className="-rotate-90 transition-transform group-hover:translate-x-1"
        />
      </a>
      <a
        href={`mailto:${email}`}
        data-testid="hero-cta-email"
        className="border-border text-foreground hover:border-foreground hover:bg-foreground/5 inline-flex items-center gap-3 border px-6 py-4 text-sm font-semibold tracking-wide transition-all active:scale-[0.98]"
      >
        <Mail size={18} strokeWidth={2} />
        {labelEmail}
      </a>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="hero-cta-linkedin"
        className="border-border text-foreground hover:border-foreground hover:bg-foreground/5 inline-flex items-center gap-3 border px-6 py-4 text-sm font-semibold tracking-wide transition-all active:scale-[0.98]"
      >
        <ExternalLink size={18} strokeWidth={2} />
        {labelLinkedin}
      </a>
    </div>
  );
}
