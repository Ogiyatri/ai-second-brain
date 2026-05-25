import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('document_chunks')
export class DocumentChunkTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'document_id' })
  documentId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'chunk_index' })
  chunkIndex: number;

  // embedding column is vector(1536) — managed via raw SQL migration
  // not mapped here because TypeORM does not support pgvector natively

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
