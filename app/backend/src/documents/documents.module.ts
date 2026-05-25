import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeOrmEntity } from './infrastructure/entities/document.typeorm-entity';
import { DocumentChunkTypeOrmEntity } from './infrastructure/entities/document-chunk.typeorm-entity';
import { TypeOrmDocumentRepository } from './infrastructure/repositories/typeorm-document.repository';
import { DocumentsService } from './application/documents.service';
import { DocumentsController } from './interface/documents.controller';
import { MinioModule } from '../shared/storage/minio.module';
import { AiInfrastructureModule } from 'src/ai/infrastructure/ai-infrastructure.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentTypeOrmEntity,
      DocumentChunkTypeOrmEntity,
    ]),
    MinioModule,
    AiInfrastructureModule,
  ],
  providers: [
    DocumentsService,
    { provide: 'IDocumentRepository', useClass: TypeOrmDocumentRepository },
  ],
  controllers: [DocumentsController],
  exports: ['IDocumentRepository'],
})
export class DocumentsModule {}
