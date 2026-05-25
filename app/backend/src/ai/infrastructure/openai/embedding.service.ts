import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OpenAIClient } from './openai.client';
import { DocumentChunkEntity } from '../../../documents/domain/entities/document-chunk.entity';

@Injectable()
export class EmbeddingService {
  constructor(
    private readonly openai: OpenAIClient,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  embedChunks(
    documentId: string,
    chunks: DocumentChunkEntity[],
  ): Promise<void> {
    // TODO: OpenAI belum aktif — uncomment setelah credits tersedia
    // for (const chunk of chunks) {
    //   const response = await this.openai.client.embeddings.create({
    //     model: 'text-embedding-3-small',
    //     input: chunk.content,
    //   });
    //   const vector = response.data[0].embedding;
    //   const vectorStr = `[${vector.join(',')}]`;
    //   await this.dataSource.query(
    //     `UPDATE document_chunks SET embedding = $1 WHERE id = $2`,
    //     [vectorStr, chunk.id],
    //   );
    // }
    console.log(
      `[EmbeddingService] Skipped embedding for ${chunks.length} chunks — OpenAI tidak aktif`,
    );
    return Promise.resolve();
  }

  similaritySearch(
    queryText: string,
    userId: string,
    documentIds: string[],
    _topK = 5,
  ): Promise<
    { id: string; documentId: string; content: string; chunkIndex: number }[]
  > {
    // TODO: OpenAI belum aktif — uncomment setelah credits tersedia
    // const response = await this.openai.client.embeddings.create({
    //   model: 'text-embedding-3-small',
    //   input: queryText,
    // });
    // const vector = response.data[0].embedding;
    // const vectorStr = `[${vector.join(',')}]`;
    // const placeholders = documentIds.map((_, i) => `$${i + 3}`).join(', ');
    // const rows = await this.dataSource.query(
    //   `SELECT id, document_id, content, chunk_index
    //    FROM document_chunks
    //    WHERE user_id = $1 AND document_id IN (${placeholders}) AND embedding IS NOT NULL
    //    ORDER BY embedding <=> $2
    //    LIMIT ${topK}`,
    //   [userId, vectorStr, ...documentIds],
    // );
    // return rows;
    return Promise.resolve([]);
  }
}
