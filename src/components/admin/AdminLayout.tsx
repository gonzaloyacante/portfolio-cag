'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { ExternalLink, LogOut, Menu, X } from 'lucide-react';

import { ADMIN_NAV, ADMIN_NAV_GROUPS } from '@/constants/admin-config';
import { authClient } from '@/lib/auth-client';

type AdminLayoutProps = {
  children: ReactNode;
  userEmail: string;
};

export default function AdminLayout({ children, userEmail }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/admin/login');
  };

  return (
    <div data-testid="admin-layout" className="bg-background text-foreground flex min-h-dvh">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`border-border bg-card fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="border-border flex items-center justify-between border-b px-6 py-5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="admin-logo-link"
            className="flex items-center gap-3"
          >
            <span className="border-border text-foreground font-display flex h-9 w-9 items-center justify-center border text-sm font-bold">
              CG
            </span>
            <div className="leading-tight">
              <div className="text-foreground font-display text-sm font-semibold tracking-tight">
                Panel admin
              </div>
              <div className="text-muted-foreground/60 text-label tracking-label font-mono uppercase">
                Carlos A. Guerra
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          {ADMIN_NAV_GROUPS.map((group) => {
            const items = ADMIN_NAV.filter((n) => n.group === group);
            return (
              <div key={group} className="mb-2">
                <div className="text-muted-foreground/50 text-label tracking-label px-6 pt-3 pb-1 font-mono uppercase">
                  {group}
                </div>
                <ul>
                  {items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          data-testid={`admin-nav-${item.href.split('/').pop()}`}
                          className={`flex items-center gap-3 border-l-2 px-6 py-2.5 text-sm transition-colors ${
                            active
                              ? 'border-foreground text-foreground bg-background'
                              : 'text-muted-foreground hover:text-foreground hover:bg-background border-transparent'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="border-border border-t px-6 py-4">
          <div className="text-muted-foreground/60 text-overline truncate font-mono">
            {userEmail}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            data-testid="admin-logout-btn"
            className="text-muted-foreground hover:text-foreground mt-3 inline-flex items-center gap-2 text-xs font-semibold transition-colors"
          >
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-background/95 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-6 backdrop-blur-sm lg:px-10">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Abrir menú"
            data-testid="admin-mobile-menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-muted-foreground/60 text-label tracking-label font-mono uppercase">
            ADMIN · v1.0
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="admin-view-site"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            Ver sitio <ExternalLink size={13} />
          </a>
        </header>

        <main className="max-w-6xl p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
