import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Identity } from './identity.entity';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { Patient } from 'src/patient/patient.entity';

@Injectable()
export class IdentityService {
  constructor(
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createDto: CreateIdentityDto): Promise<Identity> {
    const { rg, cpf, patient_id, ...rest } = createDto;

    const existingRg = await this.identityRepository.findOneBy({ rg });
    if (existingRg) {
      throw new BadRequestException(
        `Já existe uma identidade com o RG "${rg}".`,
      );
    }

    const existingCpf = await this.identityRepository.findOneBy({ cpf });
    if (existingCpf) {
      throw new BadRequestException(
        `Já existe uma identidade com o CPF "${cpf}".`,
      );
    }

    const patient = await this.patientRepository.findOne({
      where: { id: patient_id },
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente com ID ${patient_id} não encontrado`,
      );
    }

    const identity = this.identityRepository.create({
      rg,
      cpf,
      ...rest,
      patient,
    });

    return this.identityRepository.save(identity);
  }

  findAll(): Promise<Identity[]> {
    return this.identityRepository.find({ relations: ['patient'] });
  }

  async findOne(id: number): Promise<Identity> {
    const identity = await this.identityRepository.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!identity) {
      throw new NotFoundException(`Identidade com id ${id} não encontrada`);
    }
    return identity;
  }

  async update(id: number, dto: UpdateIdentityDto): Promise<Identity> {
    const identity = await this.identityRepository.findOneBy({ id });
    if (!identity) {
      throw new NotFoundException(`Identidade com ID ${id} não encontrada`);
    }

    if (dto.patient_id) {
      const patient = await this.patientRepository.findOneBy({
        id: dto.patient_id,
      });
      if (!patient) {
        throw new NotFoundException(
          `Paciente com ID ${dto.patient_id} não encontrado`,
        );
      }
      identity.patient = patient;
    }

    Object.assign(identity, dto);

    return this.identityRepository.save(identity);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.identityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Identidade com id ${id} não encontrada`);
    }
    return { message: `Identidade com ID ${id} removido com sucesso` };
  }
}
