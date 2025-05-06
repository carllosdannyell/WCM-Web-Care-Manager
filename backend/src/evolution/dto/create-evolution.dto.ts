import { IsNotEmpty, IsInt, IsString, MaxLength } from 'class-validator';

export class CreateEvolutionDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  patient_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  evolution_text: string;
}
