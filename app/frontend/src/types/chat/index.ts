export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { documentId: string; content: string }[];
  createdAt: string;
}

export interface ChatState {
  isLoading: boolean;
  error: string | null;
}
