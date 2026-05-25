import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { IDocumentRepository } from '../domain/repositories/document.repository.interface';
import { DocumentEntity } from '../domain/entities/document.entity';
import { DocumentChunkEntity } from '../domain/entities/document-chunk.entity';
import { FileTypeVO } from '../domain/value-objects/file-type.vo';
import { MinioStorageService } from '../infrastructure/storage/minio-storage.service';
import { EmbeddingService } from '../../ai/infrastructure/openai/embedding.service';
import { parsePdf } from '../infrastructure/parsers/pdf.parser';
import { parseDocx } from '../infrastructure/parsers/docx.parser';
import { parseTxt } from '../infrastructure/parsers/txt.parser';
import { chunkText } from '../infrastructure/parsers/chunker';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject('IDocumentRepository')
    private readonly documentRepo: IDocumentRepository,
    private readonly storageService: MinioStorageService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async upload(
    userId: string,
    file: Express.Multer.File,
  ): Promise<DocumentEntity> {
    new FileTypeVO(file.mimetype, file.originalname, file.size);

    const objectName = await this.storageService.upload(file);

    const document = new DocumentEntity(
      crypto.randomUUID(),
      userId,
      file.originalname,
      file.originalname,
      objectName,
      file.mimetype,
      file.size,
      'processing',
      new Date(),
    );

    await this.documentRepo.save(document);

    // Synchronous processing — user waits during upload
    try {
      const text = await this.extractText(file);
      const chunks = chunkText(text);

      const chunkEntities: DocumentChunkEntity[] = chunks.map(
        (content, i) =>
          new DocumentChunkEntity(
            crypto.randomUUID(),
            document.id,
            userId,
            content,
            i,
            new Date(),
          ),
      );

      await this.documentRepo.saveChunks(chunkEntities);

      // Generate and store embeddings
      await this.embeddingService.embedChunks(document.id, chunkEntities);

      document.markAsReady();
      await this.documentRepo.save(document);
    } catch {
      document.markAsError();
      await this.documentRepo.save(document);
    }

    return document;
  }

  async list(userId: string): Promise<DocumentEntity[]> {
    return this.documentRepo.findAllByUserId(userId);
  }

  async getById(userId: string, id: string): Promise<DocumentEntity> {
    const doc = await this.documentRepo.findById(id);
    if (!doc) throw new NotFoundException('Document not found');
    if (!doc.isOwner(userId)) throw new ForbiddenException();
    return doc;
  }

  async delete(userId: string, id: string): Promise<{ success: boolean }> {
    const doc = await this.documentRepo.findById(id);
    if (!doc) throw new NotFoundException('Document not found');
    if (!doc.isOwner(userId)) throw new ForbiddenException();

    await this.storageService.delete(doc.fileUrl);
    await this.documentRepo.delete(id);
    return { success: true };
  }

  private async extractText(file: Express.Multer.File): Promise<string> {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return parsePdf(file.buffer);
    if (ext === 'docx') return parseDocx(file.buffer);
    return parseTxt(file.buffer);
  }
}
