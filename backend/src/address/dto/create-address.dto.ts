import {
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsInt()
  patient_id: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP inválido' })
  @MaxLength(9)
  cep?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  street?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  house_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  complement?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  district?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  uf?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  region?: string;
}
