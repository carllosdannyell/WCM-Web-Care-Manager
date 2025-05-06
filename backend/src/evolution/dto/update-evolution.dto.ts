import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateEvolutionDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  evolution_text?: string;
}
