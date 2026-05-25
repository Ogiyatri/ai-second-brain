import { DocumentEntity } from '../entities/document.entity';
import { DocumentChunkEntity } from '../entities/document-chunk.entity';

export interface IDocumentRepository {
  save(document: DocumentEntity): Promise<DocumentEntity>;
  findById(id: string): Promise<DocumentEntity | null>;
  findAllByUserId(userId: string): Promise<DocumentEntity[]>;
  delete(id: string): Promise<void>;
  saveChunks(chunks: DocumentChunkEntity[]): Promise<void>;
  findChunksByDocumentId(documentId: string): Promise<DocumentChunkEntity[]>;
}
