import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axiosInstance from '@/lib/axios';
import { seoConfigFormSchema, type SeoConfigFormValues } from '@/validations/admin';

export { seoConfigFormSchema } from '@/validations/admin';
export type { SeoConfigFormValues } from '@/validations/admin';

export function useSeoForm(initial: SeoConfigFormValues, slug: string) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const form = useForm<SeoConfigFormValues>({
    resolver: zodResolver(seoConfigFormSchema),
    defaultValues: initial,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setStatus('saving');
    try {
      // Convert empty strings to null for the API
      const payload = {
        titleEs: data.titleEs || null,
        titleEn: data.titleEn || null,
        descEs: data.descEs || null,
        descEn: data.descEn || null,
        ogImage: data.ogImage || null,
        noIndex: data.noIndex,
      };
      await axiosInstance.put(`/api/admin/seo/${slug}`, payload);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  });

  return { form, onSubmit, status };
}
