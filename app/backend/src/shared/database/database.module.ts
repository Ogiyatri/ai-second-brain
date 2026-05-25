import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserTypeOrmEntity } from 'src/auth/infrastructure/entities/user.typeorm-entity';
import { DocumentTypeOrmEntity } from 'src/documents/infrastructure/entities/document.typeorm-entity';
import { DocumentChunkTypeOrmEntity } from 'src/documents/infrastructure/entities/document-chunk.typeorm-entity';
import { ChatSessionTypeOrmEntity } from 'src/ai/infrastructure/entities/chat-session.typeorm-entity';
import { ChatMessageTypeOrmEntity } from 'src/ai/infrastructure/entities/chat-message.typeorm-entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [
          UserTypeOrmEntity,
          DocumentTypeOrmEntity,
          DocumentChunkTypeOrmEntity,
          ChatSessionTypeOrmEntity,
          ChatMessageTypeOrmEntity,
        ],
        synchronize: false,
        logging: config.get('NODE_ENV') === 'development',
        poolSize: config.get<number>('DB_MAX_POOL') || 10,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class SharedDatabaseModule {}
