'use client';
import { useState } from 'react';
import { aiApi } from '@/api/ai.api';
import { to } from '@/lib/await-to-error';
import { validateGenerateForm } from '@/domains/generate';
import type { GenerateFormValues, GenerateState } from '@/types/generate';

export function useGenerate() {
  const [state, setState] = useState<GenerateState>({ isLoading: false, error: null, result: null });

  const generate = async (values: GenerateFormValues) => {
    const validationError = validateGenerateForm(values.prompt, values.type, values.document_ids);
    if (validationError) { setState((s) => ({ ...s, error: validationError })); return; }
    setState({ isLoading: true, error: null, result: null });
    const [err, data] = await to(aiApi.generate(values));
    if (err || !data) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Generation failed';
      setState({ isLoading: false, error: msg, result: null });
      return;
    }
    setState({ isLoading: false, error: null, result: data });
  };

  const reset = () => setState({ isLoading: false, error: null, result: null });

  return { ...state, generate, reset };
}
