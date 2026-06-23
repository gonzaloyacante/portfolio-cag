'use client';

import { Globe, Search, Trash2 } from 'lucide-react';

import { FieldHelp } from '@/components/admin/FieldHelp';
import { SectionGroup } from '@/components/admin/SectionGroup';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useSeoForm } from '@/hooks/use-seo-form';
import axiosInstance from '@/lib/axios';
import type { SeoConfigFormValues } from '@/validations/admin';

type SeoFormProps = {
  initial: SeoConfigFormValues;
  slug: string;
};

export function SeoForm({ initial, slug }: SeoFormProps) {
  const { form, onSubmit, status } = useSeoForm(initial, slug);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar configuración SEO para "${slug}"?`)) return;
    await axiosInstance.delete(`/api/admin/seo/${slug}`);
    window.location.reload();
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
        <SectionGroup
          icon={<Search size={14} />}
          title={`SEO: ${slug}`}
          description="Meta tags y Open Graph que Google y redes sociales ven al compartir esta página."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="titleEs"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Globe size={12} className="text-muted-foreground" />
                    <FormLabel className="text-xs font-semibold tracking-tight">
                      Título (ES)
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Carlos Guerra — Ingeniero Electrónico"
                      className="admin-focus-ring border-border bg-background/40 h-10 rounded-[var(--admin-radius)]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FieldHelp description="60 caracteres máximo. Aparece en la pestaña y en Google." />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="titleEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold tracking-tight">Title (EN)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Carlos Guerra — Electronic Engineer"
                      className="admin-focus-ring border-border bg-background/40 h-10 rounded-[var(--admin-radius)]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="descEs"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Globe size={12} className="text-muted-foreground" />
                    <FormLabel className="text-xs font-semibold tracking-tight">
                      Descripción (ES)
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Más de 30 años optimizando líneas de producción industrial..."
                      className="admin-focus-ring border-border bg-background/40 min-h-[88px] rounded-[var(--admin-radius)]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FieldHelp description="155 caracteres máximo. Aparece debajo del título en Google." />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold tracking-tight">
                    Description (EN)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Over 30 years optimizing industrial production lines..."
                      className="admin-focus-ring border-border bg-background/40 min-h-[88px] rounded-[var(--admin-radius)]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ogImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold tracking-tight">
                  Open Graph image (opcional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://res.cloudinary.com/.../og.jpg"
                    className="admin-focus-ring border-border bg-background/40 h-10 rounded-[var(--admin-radius)]"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FieldHelp description="Imagen 1200×630px para WhatsApp/LinkedIn/Twitter. Vacío = default del sitio." />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="noIndex"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between gap-4 space-y-0">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-semibold tracking-tight">
                    No indexar (noindex)
                  </FormLabel>
                  <p className="text-muted-foreground text-xs">
                    Le dice a Google que NO muestre esta página en búsquedas.
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </SectionGroup>

        <div className="admin-glass border-border sticky bottom-0 z-10 flex items-center justify-between gap-3 rounded-[var(--admin-radius-lg)] border px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="text-xs">
              {status === 'success' && (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="admin-status-dot" />
                  Guardado.
                </span>
              )}
              {status === 'error' && <span className="text-destructive">Error al guardar.</span>}
              {status === 'idle' && (
                <span className="text-muted-foreground">Los cambios se aplican al guardar.</span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-muted-foreground hover:text-destructive gap-1.5"
            >
              <Trash2 size={12} />
              Eliminar
            </Button>
          </div>
          <Button type="submit" disabled={status === 'saving'} className="admin-glow gap-1.5">
            {status === 'saving' ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
