import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionTypeOrmEntity } from './entities/chat-session.typeorm-entity';
import { ChatMessageTypeOrmEntity } from './entities/chat-message.typeorm-entity';
import { TypeOrmChatRepository } from './repositories/typeorm-chat.repository';
import { OpenAIClient } from './openai/openai.client';
import { EmbeddingService } from './openai/embedding.service';
import { CompletionService } from './openai/completion.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSessionTypeOrmEntity, ChatMessageTypeOrmEntity])],
  providers: [OpenAIClient, EmbeddingService, CompletionService, TypeOrmChatRepository],
  exports: [OpenAIClient, EmbeddingService, CompletionService, TypeOrmChatRepository],
})
export class AiInfrastructureModule {}
