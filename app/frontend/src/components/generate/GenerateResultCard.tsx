'use client';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GenerateResult } from '@/types/generate';

interface GenerateResultCardProps {
  result: GenerateResult;
  onReset: () => void;
}

export function GenerateResultCard({ result, onReset }: GenerateResultCardProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base capitalize">{result.type} Result</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[60vh]">
          <article className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{result.content}</ReactMarkdown>
          </article>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
