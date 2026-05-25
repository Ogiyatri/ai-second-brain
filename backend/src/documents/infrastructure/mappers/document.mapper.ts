import { DocumentEntity } from '../../domain/entities/document.entity';
import { DocumentTypeOrmEntity } from '../entities/document.typeorm-entity';

export class DocumentMapper {
  static toDomain(orm: DocumentTypeOrmEntity): DocumentEntity {
    return new DocumentEntity(
      orm.id,
      orm.userId,
      orm.title,
      orm.fileName,
      orm.fileUrl,
      orm.fileType,
      orm.fileSize,
      orm.status as 'processing' | 'ready' | 'error',
      orm.createdAt,
    );
  }

  static toOrm(domain: DocumentEntity): DocumentTypeOrmEntity {
    const entity = new DocumentTypeOrmEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.title = domain.title;
    entity.fileName = domain.fileName;
    entity.fileUrl = domain.fileUrl;
    entity.fileType = domain.fileType;
    entity.fileSize = domain.fileSize;
    entity.status = domain.status;
    return entity;
  }
}
