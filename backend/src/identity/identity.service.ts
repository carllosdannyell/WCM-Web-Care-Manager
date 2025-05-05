/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

@Injectable()
export class IdentityService {
  constructor(
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
  ) {}

  async create(createDto: CreateIdentityDto): Promise<Identity> {
    const { rg, cpf } = createDto;

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

    const identity = this.identityRepository.create(createDto);
    return this.identityRepository.save(identity);
  }

  async findAll(): Promise<Identity[]> {
    return this.identityRepository.find();
  }

  async findOne(id: number): Promise<Identity> {
    const identity = await this.identityRepository.findOneBy({ id });
    if (!identity) {
      throw new NotFoundException(`Identidade com id ${id} não encontrada`);
    }
    return identity;
  }

  async update(id: number, updateDto: UpdateIdentityDto): Promise<Identity> {
    const identity = await this.identityRepository.preload({
      id,
      ...updateDto,
    });

    if (!identity) {
      throw new NotFoundException(`Identidade com id ${id} não encontrada`);
    }

    return this.identityRepository.save(identity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.identityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Identidade com id ${id} não encontrada`);
    }
  }
}
