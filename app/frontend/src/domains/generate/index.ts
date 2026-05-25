import type { GenerateType } from '@/types/generate';

export const GENERATE_TYPES: { value: GenerateType; label: string }[] = [
  { value: 'ringkasan', label: 'Ringkasan' },
  { value: 'laporan', label: 'Laporan' },
  { value: 'surat', label: 'Surat' },
  { value: 'proposal', label: 'Proposal' },
];

export const validateGenerateForm = (
  prompt: string,
  type: GenerateType,
  documentIds: string[],
): string | null => {
  if (!prompt.trim()) return 'Prompt is required';
  if (!type) return 'Document type is required';
  if (documentIds.length === 0) return 'Select at least one document';
  return null;
};
