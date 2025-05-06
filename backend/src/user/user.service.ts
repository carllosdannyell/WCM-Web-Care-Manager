/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    dto.name = dto.name.trim();
    dto.email = dto.email.trim().toLowerCase();

    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('E-mail já está em uso.');
    }
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (dto.email) {
      dto.email = dto.email.trim().toLowerCase();
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException('E-mail já está em uso.');
      }
    }

    if (dto.name) {
      dto.name = dto.name.trim();
    }

    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined) {
        user[key] = value;
      }
    });

    await this.userRepository.save(user);

    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    user.status = UserStatus.INATIVO;

    await this.userRepository.save(user);

    return {
      message: `Usuário com ID ${id} marcado como inativo com sucesso`,
    };
  }
}
