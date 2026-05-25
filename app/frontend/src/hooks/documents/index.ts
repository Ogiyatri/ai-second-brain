'use client';
import { useState, useEffect, useCallback } from 'react';
import { documentsApi } from '@/api/documents.api';
import { to } from '@/lib/await-to-error';
import { validateFile } from '@/domains/documents';
import type { Document, DocumentsState } from '@/types/documents';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [state, setState] = useState<DocumentsState>({ isLoading: false, isUploading: false, error: null });

  const fetchDocuments = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    const [err, data] = await to(documentsApi.list());
    if (err || !data) {
      setState((s) => ({ ...s, isLoading: false, error: 'Failed to load documents' }));
      return;
    }
    setDocuments(data);
    setState((s) => ({ ...s, isLoading: false }));
  }, []);

  const uploadDocument = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setState((s) => ({ ...s, error: validationError }));
      return;
    }
    setState((s) => ({ ...s, isUploading: true, error: null }));
    const [err, data] = await to(documentsApi.upload(file));
    if (err || !data) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Upload failed';
      setState((s) => ({ ...s, isUploading: false, error: msg }));
      return;
    }
    setDocuments((prev) => [data, ...prev]);
    setState((s) => ({ ...s, isUploading: false }));
  };

  const deleteDocument = async (id: string) => {
    const [err] = await to(documentsApi.delete(id));
    if (err) {
      setState((s) => ({ ...s, error: 'Failed to delete document' }));
      return;
    }
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  return { documents, ...state, uploadDocument, deleteDocument, refetch: fetchDocuments };
}
