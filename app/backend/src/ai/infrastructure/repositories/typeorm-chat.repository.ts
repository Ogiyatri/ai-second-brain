import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSessionTypeOrmEntity } from '../entities/chat-session.typeorm-entity';
import { ChatMessageTypeOrmEntity } from '../entities/chat-message.typeorm-entity';

@Injectable()
export class TypeOrmChatRepository {
  constructor(
    @InjectRepository(ChatSessionTypeOrmEntity)
    private readonly sessionRepo: Repository<ChatSessionTypeOrmEntity>,
    @InjectRepository(ChatMessageTypeOrmEntity)
    private readonly messageRepo: Repository<ChatMessageTypeOrmEntity>,
  ) {}

  async createSession(userId: string, title = 'New Chat'): Promise<ChatSessionTypeOrmEntity> {
    const session = this.sessionRepo.create({ id: crypto.randomUUID(), userId, title });
    return this.sessionRepo.save(session);
  }

  async listSessions(userId: string): Promise<ChatSessionTypeOrmEntity[]> {
    return this.sessionRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async getSession(id: string, userId: string): Promise<ChatSessionTypeOrmEntity | null> {
    return this.sessionRepo.findOne({ where: { id, userId } });
  }

  async saveMessage(data: {
    sessionId: string;
    userId: string;
    role: string;
    content: string;
    sources?: object;
  }): Promise<ChatMessageTypeOrmEntity> {
    const msg = this.messageRepo.create({ id: crypto.randomUUID(), ...data });
    return this.messageRepo.save(msg);
  }

  async getMessages(sessionId: string, userId: string): Promise<ChatMessageTypeOrmEntity[]> {
    return this.messageRepo.find({
      where: { sessionId, userId },
      order: { createdAt: 'ASC' },
    });
  }
}
