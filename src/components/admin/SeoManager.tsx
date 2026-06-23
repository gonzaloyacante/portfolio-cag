'use client';

import { useState } from 'react';

import axios from 'axios';
import { Loader2, Plus } from 'lucide-react';

import { SeoForm } from '@/components/admin/SeoForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/axios';

type SeoConfig = {
  id: string;
  slug: string;
  titleEs: string | null;
  titleEn: string | null;
  descEs: string | null;
  descEn: string | null;
  ogImage: string | null;
  noIndex: boolean;
};

type SeoManagerProps = {
  initialConfigs: SeoConfig[];
};

export function SeoManager({ initialConfigs }: SeoManagerProps) {
  const [configs] = useState(initialConfigs);
  const [newSlug, setNewSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    if (!/^[a-z0-9-]+$/.test(newSlug)) {
      setError('El slug debe ser kebab-case (ej: home, projects, contact)');
      return;
    }
    setCreating(true);
    try {
      await axiosInstance.post('/api/admin/seo', { slug: newSlug });
      window.location.reload();
    } catch (e) {
      const msg =
        axios.isAxiosError(e) && e.response?.status === 409
          ? 'Ya existe una configuración con ese slug'
          : 'Error al crear la configuración';
      setError(msg);
      setCreating(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="admin-hairline bg-card/40 rounded-[var(--admin-radius-lg)] p-5 sm:p-6">
        <header className="mb-4 flex items-start gap-3">
          <div className="border-border bg-muted/40 text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--admin-radius)] border">
            <Plus size={14} />
          </div>
          <div>
            <h2 className="text-foreground text-sm font-semibold tracking-tight">
              Nueva configuración SEO
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Creá una entrada para una página que aún no tiene SEO override (ej: <code>home</code>,{' '}
              <code>projects</code>, <code>contact</code>).
            </p>
          </div>
        </header>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[260px] flex-1">
            <Label htmlFor="new-slug" className="text-xs">
              Slug
            </Label>
            <Input
              id="new-slug"
              placeholder="home"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              className="admin-focus-ring border-border bg-background/40 mt-1 h-10 rounded-[var(--admin-radius)]"
            />
          </div>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={creating || !newSlug}
            className="admin-glow gap-1.5"
          >
            {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Crear
          </Button>
        </div>
        {error && <p className="text-destructive mt-3 text-xs">{error}</p>}
      </section>

      {configs.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No hay configuraciones SEO todavía. Creá la primera arriba.
        </p>
      ) : (
        <div className="space-y-4">
          {configs.map((c) => (
            <SeoForm
              key={c.id}
              slug={c.slug}
              initial={{
                titleEs: c.titleEs ?? '',
                titleEn: c.titleEn ?? '',
                descEs: c.descEs ?? '',
                descEn: c.descEn ?? '',
                ogImage: c.ogImage ?? '',
                noIndex: c.noIndex,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
