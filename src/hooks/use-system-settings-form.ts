import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axiosInstance from '@/lib/axios';
import { systemSettingsFormSchema, type SystemSettingsFormValues } from '@/validations/admin';

export { systemSettingsFormSchema } from '@/validations/admin';
export type { SystemSettingsFormValues } from '@/validations/admin';

export function useSystemSettingsForm(initial: SystemSettingsFormValues) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const form = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(systemSettingsFormSchema),
    defaultValues: initial,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setStatus('saving');
    try {
      await axiosInstance.put('/api/admin/system', data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  });

  return { form, onSubmit, status };
}
