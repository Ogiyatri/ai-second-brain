export type GenerateType = 'ringkasan' | 'laporan' | 'surat' | 'proposal';

export interface GenerateFormValues {
  prompt: string;
  type: GenerateType;
  document_ids: string[];
}

export interface GenerateResult {
  content: string;
  type: GenerateType;
}

export interface GenerateState {
  isLoading: boolean;
  error: string | null;
  result: GenerateResult | null;
}
