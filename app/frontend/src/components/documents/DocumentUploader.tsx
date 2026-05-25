'use client';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from '@/domains/documents';

interface DocumentUploaderProps {
  onFile: (file: File) => void;
  isUploading: boolean;
}

export function DocumentUploader({ onFile, isUploading }: DocumentUploaderProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [], 'text/plain': [] },
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors',
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50',
        isUploading && 'cursor-not-allowed opacity-50',
      )}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <p className="text-sm text-muted-foreground">Uploading & processing…</p>
      ) : isDragActive ? (
        <p className="text-sm font-medium">Drop your file here</p>
      ) : (
        <>
          <p className="text-sm font-medium">Drag & drop a file here, or click to select</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX, TXT — max 10 MB</p>
        </>
      )}
    </div>
  );
}
