'use client';
import { GenerateForm } from '@/components/generate/GenerateForm';
import { GenerateResultCard } from '@/components/generate/GenerateResultCard';
import { useGenerate } from '@/hooks/generate';
import { useDocuments } from '@/hooks/documents';
import type { GenerateType } from '@/types/generate';

export default function GeneratePage() {
  const { documents } = useDocuments();
  const { isLoading, error, result, generate, reset } = useGenerate();

  const handleGenerate = (prompt: string, type: GenerateType, documentIds: string[]) => {
    generate({ prompt, type, document_ids: documentIds });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Generate Document</h2>
      {result ? (
        <GenerateResultCard result={result} onReset={reset} />
      ) : (
        <GenerateForm
          documents={documents}
          isLoading={isLoading}
          error={error}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  );
}
