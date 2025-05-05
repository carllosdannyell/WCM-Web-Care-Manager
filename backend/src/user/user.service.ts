import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
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

  async update(id: number, dto: UpdateUserDto) {
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

    await this.userRepository.update(id, dto);
    return this.userRepository.findOneBy({ id });
  }
}
