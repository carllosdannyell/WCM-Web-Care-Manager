import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Patient } from '../patient/patient.entity';

@Entity('evolution')
export class Evolution {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Patient, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ length: 500 })
  evolution_text: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
