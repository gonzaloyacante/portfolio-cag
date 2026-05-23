'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ArrowUpRight, Loader2, MessageCircle } from 'lucide-react';
import { z } from 'zod/v4';

import { zodResolver } from '@hookform/resolvers/zod';

import { useReveal } from '@/hooks/use-reveal';
import { messagesService } from '@/services/messages-service';

import { ContactField } from './ContactField';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

type ContactFormData = z.infer<typeof contactSchema>;

type FeedbackState = { type: 'success' | 'error'; text: string } | null;

type ContactFormProps = {
  whatsappNumber: string;
};

function buildWaText(waPrefix: string, data: ContactFormData): string {
  const lines = [waPrefix, '', `• ${data.name}`, `• ${data.email}`];
  if (data.phone) lines.push(`• ${data.phone}`);
  lines.push('', data.message);
  return encodeURIComponent(lines.join('\n'));
}

export function ContactForm({ whatsappNumber }: ContactFormProps) {
  const t = useTranslations('contact.form');
  const locale = useLocale();
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [ref, visible] = useReveal<HTMLDivElement>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    setFeedback(null);
    try {
      await messagesService.submit({ ...data, locale });
    } catch (err) {
      console.error('[contact] persist failed — degrading to WhatsApp only', err);
    }
    const text = buildWaText(t('wa_prefix'), data);
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
    setFeedback({ type: 'success', text: t('success') });
    reset();
    window.setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div
      ref={ref}
      className={`transition-all delay-150 duration-700 lg:col-span-7 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="contact-form"
        noValidate
        className="border-border bg-card border p-7 lg:p-10"
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="text-muted-foreground/60 text-label tracking-label font-mono uppercase">
            FORM · 002 / CONSULTA TÉCNICA
          </span>
          <span className="num text-muted-foreground/60 text-label font-mono">v1.2</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ContactField
            id="cf-name"
            name="name"
            label={t('name')}
            required
            autoComplete="name"
            testId="contact-input-name"
            error={errors.name?.message}
            registration={register('name')}
          />
          <ContactField
            id="cf-email"
            name="email"
            type="email"
            label={t('email')}
            required
            autoComplete="email"
            testId="contact-input-email"
            error={errors.email?.message}
            registration={register('email')}
          />
          <div className="sm:col-span-2">
            <ContactField
              id="cf-phone"
              name="phone"
              type="tel"
              label={t('phone')}
              autoComplete="tel"
              testId="contact-input-phone"
              registration={register('phone')}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="cf-msg"
              className="text-muted-foreground/60 text-label tracking-label mb-2 block font-mono uppercase"
            >
              {t('message')}
            </label>
            <textarea
              id="cf-msg"
              rows={5}
              data-testid="contact-input-message"
              aria-invalid={!!errors.message}
              className="border-border focus:border-foreground text-foreground placeholder:text-muted-foreground/40 w-full resize-none border-0 border-b bg-transparent py-2 text-base transition-colors outline-none"
              {...register('message')}
            />
            {errors.message && (
              <p role="alert" className="text-destructive mt-1 text-xs">
                {errors.message.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          data-testid="contact-submit"
          className="bg-foreground text-background hover:bg-foreground/90 group mt-10 inline-flex items-center justify-center gap-3 px-7 py-4 text-sm font-semibold tracking-wide transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <MessageCircle size={16} strokeWidth={2.2} />
          )}
          {t('submit')}
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>

        <p className="text-muted-foreground/60 mt-5 max-w-md text-xs leading-relaxed">
          {t('note')}
        </p>

        {feedback && (
          <div
            data-testid="contact-feedback"
            role={feedback.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            className={`animate-fade-up mt-6 border px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'border-border bg-background text-foreground'
                : 'border-destructive/40 bg-destructive/10 text-destructive'
            }`}
          >
            {feedback.text}
          </div>
        )}
      </form>
    </div>
  );
}
