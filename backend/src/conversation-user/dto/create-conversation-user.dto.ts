import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateConversationUserDto {
  @IsNotEmpty()
  @IsInt()
  conversation_id: number;

  @IsNotEmpty()
  @IsInt()
  user_id: number;
}
