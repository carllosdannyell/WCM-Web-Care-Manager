import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  IsArray,
  ArrayMinSize,
  IsInt,
} from 'class-validator';

export class CreateConversationDto {
  @IsBoolean()
  is_group: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  name?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  user_ids: number[];
}
