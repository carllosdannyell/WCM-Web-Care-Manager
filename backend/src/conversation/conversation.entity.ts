import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ConversationUser } from '../conversation-user/conversation-user.entity';
import { Message } from '../message/message.entity';

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean' })
  is_group: boolean;

  @Column({ length: 45, nullable: true })
  name?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ConversationUser, (cu) => cu.conversation)
  participants: ConversationUser[];

  @OneToMany(() => Message, (msg) => msg.conversation)
  messages: Message[];
}
