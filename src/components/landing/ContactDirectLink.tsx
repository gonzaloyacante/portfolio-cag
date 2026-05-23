import { ArrowUpRight, type LucideIcon } from 'lucide-react';

type ContactDirectLinkProps = {
  href: string;
  external?: boolean;
  testId: string;
  icon: LucideIcon;
  labelTop: string;
  labelBottom: string;
};

export function ContactDirectLink({
  href,
  external = false,
  testId,
  icon: Icon,
  labelTop,
  labelBottom,
}: ContactDirectLinkProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <li className="border-border border-b">
      <a
        href={href}
        {...externalProps}
        data-testid={testId}
        className="group hover:bg-card flex items-center justify-between px-1 py-5 transition-colors"
      >
        <span className="flex items-center gap-4">
          <Icon
            size={18}
            className="text-muted-foreground group-hover:text-foreground transition-colors"
          />
          <span>
            <span className="text-muted-foreground/60 text-label tracking-label block font-mono uppercase">
              {labelTop}
            </span>
            <span className="text-foreground font-display block text-base break-all lg:text-lg">
              {labelBottom}
            </span>
          </span>
        </span>
        <ArrowUpRight
          size={18}
          className="text-muted-foreground/40 group-hover:text-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </li>
  );
}
