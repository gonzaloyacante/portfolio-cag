import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type MarqueeProps = {
  children: ReactNode;
  className?: string;
};

export function Marquee({ children, className }: MarqueeProps) {
  return (
    <div className={cn('marquee-mask overflow-hidden', className)}>
      <div className="marquee-track">{children}</div>
    </div>
  );
}
