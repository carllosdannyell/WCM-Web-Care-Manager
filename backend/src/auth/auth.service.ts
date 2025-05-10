/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: CreateUserDto) {
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

  async login(email: string, password: string) {
    email = email.trim().toLowerCase();
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return new UnauthorizedException('Credenciais Inválidas');
    }

    const [salt, storeHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storeHash !== hash.toString('hex')) {
      return new UnauthorizedException('Credenciais Inválidas');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return { token: this.jwtService.sign(payload) };
  }
}
