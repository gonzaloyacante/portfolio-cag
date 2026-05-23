'use client';

import { cn } from '@/lib/utils';

type LangSwitchProps = {
  locales: readonly string[];
  current: string;
  onSwitch: (locale: string) => void;
  label: string;
  testId?: string;
  className?: string;
};

export function LangSwitch({
  locales,
  current,
  onSwitch,
  label,
  testId,
  className,
}: LangSwitchProps) {
  const currentIndex = locales.indexOf(current);
  return (
    <div
      data-testid={testId}
      role="group"
      aria-label={label}
      className={cn(
        'border-border hover:border-muted-foreground tracking-label relative flex items-center border font-mono transition-colors select-none',
        className
      )}
    >
      <span
        aria-hidden
        className="bg-primary absolute top-0 bottom-0 transition-transform duration-300 ease-out"
        style={{
          width: `${100 / locales.length}%`,
          transform: `translateX(${currentIndex * 100}%)`,
        }}
      />
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => onSwitch(loc)}
          aria-pressed={loc === current}
          data-testid={testId ? `${testId}-${loc}` : undefined}
          className={cn(
            'text-label relative z-10 px-2.5 py-1.5 uppercase transition-colors duration-300',
            loc === current
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
