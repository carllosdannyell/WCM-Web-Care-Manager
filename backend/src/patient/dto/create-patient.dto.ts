import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsInt,
  MaxLength,
} from 'class-validator';
import { PatientStatus } from '../patient.entity';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  social_name: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(45)
  email?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  phone: string;

  @IsOptional()
  @IsEnum(PatientStatus)
  status?: PatientStatus;
}
