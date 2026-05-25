import apiClient from '@/lib/api-client';
import type { Document } from '@/types/documents';

export const documentsApi = {
  upload: async (file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<Document>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  list: async (): Promise<Document[]> => {
    const res = await apiClient.get<Document[]>('/documents');
    return res.data;
  },

  getById: async (id: string): Promise<Document> => {
    const res = await apiClient.get<Document>(`/documents/${id}`);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },
};
