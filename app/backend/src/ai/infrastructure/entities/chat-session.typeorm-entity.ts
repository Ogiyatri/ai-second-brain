import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('chat_sessions')
export class ChatSessionTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ default: 'New Chat' })
  title: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
