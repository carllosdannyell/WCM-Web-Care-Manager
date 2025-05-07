/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

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
      return new BadRequestException('E-mail já está em uso.');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
    const saltAndHash = `${salt}.${hash.toString('hex')}`;

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: saltAndHash,
      role: dto.role,
    });

    const { password: _, ...result } = await this.userRepository.save(user);

    return result;
  }

  async findAll() {
    const users = await this.userRepository.find();
    const userMap = users.map((user) => {
      const { password: _, ...result } = user;
      return result;
    });
    return userMap;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    const { password: _, ...result } = user;
    return result;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (dto.email) {
      dto.email = dto.email.trim().toLowerCase();
      const existingUserByEmail = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (existingUserByEmail && existingUserByEmail.id !== id) {
        return new BadRequestException('E-mail já está em uso.');
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

    const { password: _, ...result } = await this.userRepository.save(user);

    return result;
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    user.status = UserStatus.INATIVO;

    await this.userRepository.save(user);

    return {
      message: `Usuário com ID ${id} marcado como inativo com sucesso`,
    };
  }
}
