import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axiosInstance from '@/lib/axios';
import { contactInfoFormSchema, type ContactInfoFormValues } from '@/validations/admin';

export { contactInfoFormSchema } from '@/validations/admin';
export type { ContactInfoFormValues } from '@/validations/admin';

export function useContactInfoForm(initial: ContactInfoFormValues) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoFormSchema),
    defaultValues: initial,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setStatus('saving');
    try {
      await axiosInstance.put('/api/admin/contact-info', data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  });

  return { form, onSubmit, status };
}
