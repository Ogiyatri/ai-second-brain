import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IDocumentRepository } from '../../domain/repositories/document.repository.interface';
import { DocumentEntity } from '../../domain/entities/document.entity';
import { DocumentChunkEntity } from '../../domain/entities/document-chunk.entity';
import { DocumentTypeOrmEntity } from '../entities/document.typeorm-entity';
import { DocumentChunkTypeOrmEntity } from '../entities/document-chunk.typeorm-entity';
import { DocumentMapper } from '../mappers/document.mapper';

@Injectable()
export class TypeOrmDocumentRepository implements IDocumentRepository {
  constructor(
    @InjectRepository(DocumentTypeOrmEntity)
    private readonly docRepo: Repository<DocumentTypeOrmEntity>,
    @InjectRepository(DocumentChunkTypeOrmEntity)
    private readonly chunkRepo: Repository<DocumentChunkTypeOrmEntity>,
  ) {}

  async save(document: DocumentEntity): Promise<DocumentEntity> {
    const orm = DocumentMapper.toOrm(document);
    const saved = await this.docRepo.save(orm);
    return DocumentMapper.toDomain(saved);
  }

  async findById(id: string): Promise<DocumentEntity | null> {
    const orm = await this.docRepo.findOneBy({ id });
    return orm ? DocumentMapper.toDomain(orm) : null;
  }

  async findAllByUserId(userId: string): Promise<DocumentEntity[]> {
    const orms = await this.docRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return orms.map((orm) => DocumentMapper.toDomain(orm));
  }

  async delete(id: string): Promise<void> {
    await this.chunkRepo.delete({ documentId: id });
    await this.docRepo.delete({ id });
  }

  async saveChunks(chunks: DocumentChunkEntity[]): Promise<void> {
    const orms = chunks.map((c) => {
      const entity = new DocumentChunkTypeOrmEntity();
      entity.id = c.id;
      entity.documentId = c.documentId;
      entity.userId = c.userId;
      entity.content = c.content;
      entity.chunkIndex = c.chunkIndex;
      return entity;
    });
    await this.chunkRepo.save(orms);
  }

  async findChunksByDocumentId(
    documentId: string,
  ): Promise<DocumentChunkEntity[]> {
    const orms = await this.chunkRepo.find({
      where: { documentId },
      order: { chunkIndex: 'ASC' },
    });
    return orms.map(
      (o) =>
        new DocumentChunkEntity(
          o.id,
          o.documentId,
          o.userId,
          o.content,
          o.chunkIndex,
          o.createdAt,
        ),
    );
  }

  async findChunksByDocumentIds(
    documentIds: string[],
  ): Promise<DocumentChunkEntity[]> {
    if (!documentIds.length) return [];
    const orms = await this.chunkRepo.find({
      where: { documentId: In(documentIds) },
    });
    return orms.map(
      (o) =>
        new DocumentChunkEntity(
          o.id,
          o.documentId,
          o.userId,
          o.content,
          o.chunkIndex,
          o.createdAt,
        ),
    );
  }
}
