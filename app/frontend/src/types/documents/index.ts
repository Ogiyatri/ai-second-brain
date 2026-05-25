export interface Document {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  status: 'processing' | 'ready' | 'error';
  createdAt: string;
}

export interface DocumentsState {
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
}
