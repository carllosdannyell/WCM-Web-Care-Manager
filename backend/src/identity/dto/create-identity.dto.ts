import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  MaxLength,
  IsNotEmpty,
  IsInt,
} from 'class-validator';

export class CreateIdentityDto {
  @IsNotEmpty()
  @IsInt()
  patient_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  rg: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  cpf: string;

  @IsNotEmpty()
  @IsDateString()
  birthdate: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  gender?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  race?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  marital_status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  nationality?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  naturalness?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  education?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  profession?: string;
}
