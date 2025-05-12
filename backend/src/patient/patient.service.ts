import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient, PatientStatus } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { User } from '../user/user.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const { user_id, ...patientData } = createPatientDto;

    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${user_id} não encontrado`);
    }

    const newPatient = this.patientRepository.create({
      ...patientData,
      user,
    });

    return this.patientRepository.save(newPatient);
  }

  findAll(): Promise<Patient[]> {
    return this.patientRepository.find({
      relations: ['identity', 'address', 'user'],
    });
  }

  async findOne(id: number): Promise<Patient | null> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['identity', 'address', 'user'],
    });
    if (!patient) {
      throw new NotFoundException(`Paciente com id ${id} não encontrado`);
    }
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['identity', 'address', 'user'],
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado`);
    }

    Object.assign(patient, updatePatientDto);

    if (updatePatientDto.user_id) {
      const user = await this.userRepository.findOne({
        where: { id: updatePatientDto.user_id },
      });

      if (!user) {
        throw new NotFoundException(
          `Usuário com ID ${updatePatientDto.user_id} não encontrado`,
        );
      }

      patient.user = user;
    }

    await this.patientRepository.save(patient);
    return this.patientRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<{ message: string }> {
    const patient = await this.patientRepository.findOneBy({ id });

    if (!patient) {
      throw new NotFoundException(`Paciente com ID ${id} não encontrado`);
    }

    patient.status = PatientStatus.INATIVO;

    await this.patientRepository.save(patient);

    return {
      message: `Paciente com ID ${id} marcado como inativo com sucesso`,
    };
  }
}
