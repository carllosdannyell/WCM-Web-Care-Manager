import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Patient } from '../patient/patient.entity';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Patient, (patient) => patient.identity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ length: 9, nullable: true })
  cep?: string;

  @Column({ length: 45, nullable: true })
  street?: string;

  @Column({ length: 10, nullable: true })
  house_number?: string;

  @Column({ length: 45, nullable: true })
  complement?: string;

  @Column({ length: 45, nullable: true })
  district?: string;

  @Column({ length: 45, nullable: true })
  city?: string;

  @Column({ length: 45, nullable: true })
  uf?: string;

  @Column({ length: 45, nullable: true })
  region?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
