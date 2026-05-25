'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { GENERATE_TYPES } from '@/domains/generate';
import type { Document } from '@/types/documents';
import type { GenerateType } from '@/types/generate';

interface GenerateFormProps {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  onGenerate: (prompt: string, type: GenerateType, documentIds: string[]) => void;
}

export function GenerateForm({ documents, isLoading, error, onGenerate }: GenerateFormProps) {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<GenerateType>('ringkasan');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleDocument = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt, type, selectedIds);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Document Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as GenerateType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GENERATE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Select Source Documents</Label>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Upload documents first.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className={`cursor-pointer border-2 transition-colors ${selectedIds.includes(doc.id) ? 'border-primary' : 'border-transparent'}`}
                onClick={() => toggleDocument(doc.id)}
              >
                <CardContent className="py-2 px-3">
                  <p className="truncate text-sm font-medium">{doc.title || doc.fileName}</p>
                  <p className="text-xs text-muted-foreground">{doc.status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt / Instructions</Label>
        <Textarea
          id="prompt"
          placeholder="e.g. Buat ringkasan singkat tentang poin-poin utama dokumen ini"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Generating…' : 'Generate'}
      </Button>
    </form>
  );
}
