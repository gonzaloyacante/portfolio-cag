import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axiosInstance from '@/lib/axios';
import { sectionMetaFormSchema, type SectionMetaFormValues } from '@/validations/admin';

export { sectionMetaFormSchema } from '@/validations/admin';
export type { SectionMetaFormValues } from '@/validations/admin';

export function useSectionMetaForm(slug: string, initial: SectionMetaFormValues) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const form = useForm<SectionMetaFormValues>({
    resolver: zodResolver(sectionMetaFormSchema),
    defaultValues: initial,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setStatus('saving');
    try {
      await axiosInstance.put(`/api/admin/sections/${slug}`, data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  });

  return { form, onSubmit, status };
}
