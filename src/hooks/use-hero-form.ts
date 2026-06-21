import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';

import axiosInstance from '@/lib/axios';
import { heroFormSchema, type HeroFormInput, type HeroFormValues } from '@/validations/admin';

export { heroFormSchema } from '@/validations/admin';
export type { HeroFormValues } from '@/validations/admin';
export type { HeroFormInput } from '@/validations/admin';

export function useHeroForm(initial: HeroFormValues) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // `TFieldValues = HeroFormInput` so raw form fields (where stat.order is
  // optional until appended) match react-hook-form's expectations.
  // `TTransformedValues = HeroFormValues` so handleSubmit's callback
  // receives data with defaults applied.
  const form = useForm<HeroFormInput, unknown, HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: initial,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stats',
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setStatus('saving');
    try {
      await axiosInstance.put('/api/admin/hero', data);
      setStatus('success');
      toast.success('Hero guardado', { description: 'Los cambios ya se ven en la landing.' });
    } catch {
      setStatus('error');
      toast.error('No se pudo guardar', { description: 'Revisá los datos e intentá de nuevo.' });
    }
  });

  const addStat = () => append({ value: '', labelEs: '', labelEn: '', order: fields.length });

  return { form, fields, addStat, remove, onSubmit, status };
}
