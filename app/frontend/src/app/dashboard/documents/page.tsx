'use client';
import type { Metadata } from 'next';
import { DocumentUploader } from '@/components/documents/DocumentUploader';
import { DocumentList } from '@/components/documents/DocumentList';
import { useDocuments } from '@/hooks/documents';

export default function DocumentsPage() {
  const { documents, isLoading, isUploading, error, uploadDocument, deleteDocument } = useDocuments();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Documents</h2>
      <DocumentUploader onFile={uploadDocument} isUploading={isUploading} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <DocumentList documents={documents} onDelete={deleteDocument} />
      )}
    </div>
  );
}
