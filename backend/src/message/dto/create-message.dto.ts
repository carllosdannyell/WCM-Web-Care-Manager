import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsInt()
  conversation_id: number;

  @IsNotEmpty()
  @IsInt()
  sender_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;
}
