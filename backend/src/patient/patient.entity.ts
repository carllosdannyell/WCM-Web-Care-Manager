import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum PatientStatus {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
}

import { User } from '../user/user.entity';

@Entity('patient')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  social_name: string;

  @Column({ length: 45, nullable: true })
  email?: string;

  @Column({ length: 45 })
  phone: string;

  @Column({
    type: 'enum',
    enum: PatientStatus,
    default: PatientStatus.ATIVO,
  })
  status: PatientStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
