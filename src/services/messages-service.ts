import axiosInstance from '@/lib/axios';

export type MessagePayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale: string;
};

export const messagesService = {
  submit: (payload: MessagePayload) =>
    axiosInstance.post<{ ok: boolean }>('/api/messages', payload),
};
