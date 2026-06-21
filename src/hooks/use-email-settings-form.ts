import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axiosInstance from '@/lib/axios';
import { emailSettingsFormSchema, type EmailSettingsFormValues } from '@/validations/admin';

export { emailSettingsFormSchema } from '@/validations/admin';
export type { EmailSettingsFormValues } from '@/validations/admin';

export function useEmailSettingsForm(initial: EmailSettingsFormValues) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const form = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsFormSchema),
    defaultValues: initial,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setStatus('saving');
    try {
      await axiosInstance.put('/api/admin/email-settings', data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  });

  return { form, onSubmit, status };
}
