'use client';

import { useState } from 'react';

import { Bell, BellOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { usePushSubscription } from '@/hooks/use-push-subscription';
import { cn } from '@/lib/utils';

/**
 * Toggle that lets the admin enable/disable push notifications for the
 * admin PWA. Hidden entirely on browsers without Push API support.
 *
 * Sits in the AdminLayout header. On iOS it requires the PWA to be
 * installed via "Add to Home Screen" — `Notification.permission` will
 * be 'default' until then, and the subscribe call will fail.
 *
 * Labels are hardcoded in Spanish because the admin panel is single-locale
 * (no `/es|/en` prefix). Hardcoding avoids wrapping `admin/layout.tsx`
 * with `NextIntlClientProvider` just for this one component.
 */
const LABELS = {
  enable: 'Activar notificaciones',
  disable: 'Notificaciones activas',
  blocked: 'Bloqueadas en el navegador',
  loading: 'Verificando soporte…',
} as const;

export function NotificationsToggle() {
  const { state, subscribe, unsubscribe } = usePushSubscription();
  const [busy, setBusy] = useState(false);

  if (state.kind === 'unsupported' || state.kind === 'loading') {
    if (state.kind === 'unsupported') return null;
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        aria-label={LABELS.loading}
        className="text-muted-foreground/60 gap-1.5 px-2.5"
      >
        <Loader2 size={13} className="animate-spin" />
      </Button>
    );
  }

  const subscribed = state.kind === 'subscribed';
  const denied = state.kind === 'denied';

  const onClick = async () => {
    setBusy(true);
    try {
      if (subscribed) await unsubscribe();
      else await subscribe();
    } finally {
      setBusy(false);
    }
  };

  const label = subscribed ? LABELS.disable : denied ? LABELS.blocked : LABELS.enable;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={busy || denied}
      data-testid="admin-notifications-toggle"
      title={label}
      aria-label={label}
      className={cn(
        'gap-1.5 px-2.5 text-xs',
        subscribed ? 'text-foreground' : 'text-muted-foreground'
      )}
    >
      {busy ? (
        <Loader2 size={13} className="animate-spin" />
      ) : subscribed ? (
        <Bell size={13} />
      ) : (
        <BellOff size={13} />
      )}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
