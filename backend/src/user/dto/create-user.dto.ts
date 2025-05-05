import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { AccessLevel, UserStatus } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(45)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.ATIVO;

  @IsNotEmpty()
  @IsEnum(AccessLevel)
  access_level: AccessLevel = AccessLevel.CONVIDADO;
}
