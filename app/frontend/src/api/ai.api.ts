import apiClient from '@/lib/api-client';
import type { ChatSession, ChatMessage } from '@/types/chat';
import type { GenerateFormValues, GenerateResult } from '@/types/generate';

export const aiApi = {
  createSession: async (): Promise<ChatSession> => {
    const res = await apiClient.post<ChatSession>('/ai/sessions');
    return res.data;
  },

  listSessions: async (): Promise<ChatSession[]> => {
    const res = await apiClient.get<ChatSession[]>('/ai/sessions');
    return res.data;
  },

  getMessages: async (sessionId: string): Promise<ChatMessage[]> => {
    const res = await apiClient.get<ChatMessage[]>(
      `/ai/sessions/${sessionId}/messages`,
    );
    return res.data;
  },

  generate: async (payload: GenerateFormValues): Promise<GenerateResult> => {
    const res = await apiClient.post<GenerateResult>('/ai/generate', payload);
    return res.data;
  },
};
