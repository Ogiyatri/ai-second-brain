import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('chat_messages')
export class ChatMessageTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  role: string; // user | assistant

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  sources: object;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
