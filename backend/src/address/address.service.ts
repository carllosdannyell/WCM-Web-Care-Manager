import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Patient } from '../patient/patient.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(dto: CreateAddressDto): Promise<Address> {
    const patient = await this.patientRepository.findOneBy({
      id: dto.patient_id,
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente com ID ${dto.patient_id} não encontrado`,
      );
    }

    const address = this.addressRepository.create({
      ...dto,
      patient,
    });

    return this.addressRepository.save(address);
  }

  findAll(): Promise<Address[]> {
    return this.addressRepository.find({ relations: ['patient'] });
  }

  async findOne(id: number): Promise<Address | null> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!address) {
      throw new NotFoundException(`Identidade com id ${id} não encontrada`);
    }
    return address;
  }

  async update(id: number, dto: UpdateAddressDto): Promise<Address> {
    const address = await this.addressRepository.findOneBy({ id });
    if (!address)
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);

    if (dto.patient_id) {
      const patient = await this.patientRepository.findOneBy({
        id: dto.patient_id,
      });
      if (!patient) {
        throw new NotFoundException(
          `Paciente com ID ${dto.patient_id} não encontrado`,
        );
      }
      address.patient = patient;
    }

    Object.assign(address, dto);
    return this.addressRepository.save(address);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.addressRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }

    return { message: `Endereço com ID ${id} removido com sucesso` };
  }
}
