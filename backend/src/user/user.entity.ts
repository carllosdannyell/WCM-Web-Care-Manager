import * as bcrypt from 'bcrypt';
import { ConversationUser } from 'src/conversation-user/conversation-user.entity';
import { Message } from 'src/message/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';

export enum UserStatus {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
}

export enum AccessLevel {
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

  @Column({ length: 255, select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: AccessLevel,
  })
  access_level: AccessLevel;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @OneToMany(() => ConversationUser, (cu) => cu.user)
  conversations: ConversationUser[];

  @OneToMany(() => Message, (msg) => msg.sender)
  messages: Message[];
}
