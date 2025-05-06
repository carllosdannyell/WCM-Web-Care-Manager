import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Evolution } from './evolution.entity';
import { Repository } from 'typeorm';
import { CreateEvolutionDto } from './dto/create-evolution.dto';
import { UpdateEvolutionDto } from './dto/update-evolution.dto';
import { User } from '../user/user.entity';
import { Patient } from '../patient/patient.entity';

@Injectable()
export class EvolutionService {
  constructor(
    @InjectRepository(Evolution)
    private evolutionRepo: Repository<Evolution>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async create(dto: CreateEvolutionDto): Promise<Evolution> {
    const user = await this.userRepo.findOneBy({ id: dto.user_id });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const patient = await this.patientRepo.findOneBy({ id: dto.patient_id });
    if (!patient) throw new NotFoundException('Paciente não encontrado');

    const evolution = this.evolutionRepo.create({
      user,
      patient,
      evolution_text: dto.evolution_text,
    });

    return this.evolutionRepo.save(evolution);
  }

  findAll(): Promise<Evolution[]> {
    return this.evolutionRepo.find({ relations: ['user', 'patient'] });
  }

  findByPatient(patientId: number): Promise<Evolution[]> {
    return this.evolutionRepo.find({
      where: { patient: { id: patientId } },
      relations: ['user'],
    });
  }

  async update(id: number, dto: UpdateEvolutionDto): Promise<Evolution> {
    await this.evolutionRepo.update(id, dto);
    const updated = await this.evolutionRepo.findOneBy({ id });
    if (!updated) throw new NotFoundException('Evolução não encontrada');
    return updated;
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.evolutionRepo.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Evolução com id ${id} não encontrada`);
    }
    await this.evolutionRepo.delete(id);
    return { message: `Evolução com id ${id} removida com sucesso.` };
  }
}
