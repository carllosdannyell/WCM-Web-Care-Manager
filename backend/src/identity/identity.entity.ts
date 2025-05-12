import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../patient/patient.entity';

@Entity('identity')
export class Identity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Patient, (patient) => patient.identity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ length: 45, unique: true })
  rg: string;

  @Column({ length: 45, unique: true })
  cpf: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ type: 'float', nullable: true })
  height?: number;

  @Column({ length: 45, nullable: true })
  gender?: string;

  @Column({ length: 45, nullable: true })
  race?: string;

  @Column({ length: 45, nullable: true })
  marital_status?: string;

  @Column({ length: 45, nullable: true })
  nationality?: string;

  @Column({ length: 45, nullable: true })
  naturalness?: string;

  @Column({ length: 45, nullable: true })
  education?: string;

  @Column({ length: 45, nullable: true })
  profession?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
