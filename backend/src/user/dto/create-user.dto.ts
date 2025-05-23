import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserRole, UserStatus } from '../user.entity';

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
  @MaxLength(255)
  password: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
