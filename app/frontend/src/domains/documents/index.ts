export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const validateFile = (file: File): string | null => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Only PDF, DOCX, and TXT files are allowed';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'File size must not exceed 10 MB';
  }
  return null;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    processing: 'Processing',
    ready: 'Ready',
    error: 'Error',
  };
  return map[status] ?? status;
};
