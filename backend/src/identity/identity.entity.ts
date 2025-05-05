import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('identity')
@Unique(['rg'])
@Unique(['cpf'])
export class Identity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  rg: string;

  @Column({ length: 45 })
  cpf: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ length: 45, nullable: true })
  gender: string;

  @Column({ length: 45, nullable: true })
  race: string;

  @Column({ length: 45, nullable: true })
  marital_status: string;

  @Column({ length: 45, nullable: true })
  nationality: string;

  @Column({ length: 45, nullable: true })
  naturalness: string;

  @Column({ length: 45, nullable: true })
  education: string;

  @Column({ length: 45, nullable: true })
  profession: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
