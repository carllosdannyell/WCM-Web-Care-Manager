import { ConversationUser } from 'src/conversation-user/conversation-user.entity';
import { Message } from 'src/message/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserStatus {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
}

export enum UserRole {
  ADMINISTRADOR = 'Administrador',
  PROFISSIONAL = 'Profissional',
  CONVIDADO = 'Convidado',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  name: string;

  @Column({ length: 45, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ATIVO,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PROFISSIONAL,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ConversationUser, (cu) => cu.user)
  conversations: ConversationUser[];

  @OneToMany(() => Message, (msg) => msg.sender)
  messages: Message[];
}
