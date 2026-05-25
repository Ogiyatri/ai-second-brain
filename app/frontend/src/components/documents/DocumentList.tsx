'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatFileSize, getStatusLabel } from '@/domains/documents';
import type { Document } from '@/types/documents';

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  ready: 'default',
  processing: 'secondary',
  error: 'destructive',
};

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No documents yet. Upload your first file above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {documents.map((doc) => (
        <li key={doc.id}>
          <Card>
            <CardContent className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doc.title || doc.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(doc.fileSize)} · {doc.fileType?.toUpperCase()}
                </p>
              </div>
              <Badge variant={statusVariant[doc.status] ?? 'secondary'}>
                {getStatusLabel(doc.status)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(doc.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
