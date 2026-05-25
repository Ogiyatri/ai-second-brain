import { Injectable, NotFoundException } from '@nestjs/common';
import { EmbeddingService } from '../infrastructure/openai/embedding.service';
import { CompletionService } from '../infrastructure/openai/completion.service';
import { TypeOrmChatRepository } from '../infrastructure/repositories/typeorm-chat.repository';

@Injectable()
export class AiService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly completionService: CompletionService,
    private readonly chatRepo: TypeOrmChatRepository,
  ) {}

  async createSession(userId: string) {
    return this.chatRepo.createSession(userId);
  }

  async listSessions(userId: string) {
    return this.chatRepo.listSessions(userId);
  }

  async getMessages(sessionId: string, userId: string) {
    const session = await this.chatRepo.getSession(sessionId, userId);
    if (!session) throw new NotFoundException('Session not found');
    return this.chatRepo.getMessages(sessionId, userId);
  }

  async chat(
    userId: string,
    message: string,
    documentIds: string[],
    sessionId?: string,
  ) {
    let session = sessionId
      ? await this.chatRepo.getSession(sessionId, userId)
      : null;

    if (!session) {
      session = await this.chatRepo.createSession(userId, message.slice(0, 60));
    }

    await this.chatRepo.saveMessage({
      sessionId: session.id,
      userId,
      role: 'user',
      content: message,
    });

    let systemPrompt: string;
    let sources: object[] = [];

    if (documentIds?.length) {
      const chunks = await this.embeddingService.similaritySearch(
        message,
        userId,
        documentIds,
      );
      sources = chunks.map((c) => ({
        documentId: c.documentId,
        content: c.content.slice(0, 200),
      }));

      const context = chunks
        .map((c, i) => `[${i + 1}] ${c.content}`)
        .join('\n\n');
      systemPrompt = `You are a helpful assistant. Answer based on the following document context:\n\n${context}\n\nIf the answer is not in the context, say you don't know.`;
    } else {
      systemPrompt = 'You are a helpful assistant.';
    }

    const answer = await this.completionService.chat(systemPrompt, message);

    const assistantMessage = await this.chatRepo.saveMessage({
      sessionId: session.id,
      userId,
      role: 'assistant',
      content: answer,
      sources,
    });

    return assistantMessage;
  }

  async generate(
    userId: string,
    prompt: string,
    type: string,
    documentIds: string[],
  ) {
    const chunks = documentIds.length
      ? await this.embeddingService.similaritySearch(
          prompt,
          userId,
          documentIds,
          10,
        )
      : [];

    const context = chunks.map((c) => c.content).join('\n\n');

    const typePrompts: Record<string, string> = {
      ringkasan:
        'Buat ringkasan yang padat dan informatif dari konten berikut.',
      laporan: 'Buat laporan formal yang terstruktur dari konten berikut.',
      surat: 'Buat surat resmi yang profesional berdasarkan konten berikut.',
      proposal: 'Buat proposal yang meyakinkan berdasarkan konten berikut.',
    };

    const systemPrompt = `${typePrompts[type] || 'Generate a document based on the following content.'}\n\nKonten:\n${context}`;

    const content = await this.completionService.chat(systemPrompt, prompt);
    return { content, type };
  }
}
