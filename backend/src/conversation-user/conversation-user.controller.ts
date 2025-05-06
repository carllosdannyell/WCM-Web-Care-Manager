import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ConversationUserService } from './conversation-user.service';
import { CreateConversationUserDto } from './dto/create-conversation-user.dto';
import { DeleteConversationUserDto } from './dto/delete-conversation-user.dto';

@Controller('conversation-user')
export class ConversationUserController {
  constructor(private readonly service: ConversationUserService) {}

  @Post()
  add(@Body() dto: CreateConversationUserDto) {
    return this.service.addParticipant(dto);
  }

  @Get('conversation/:conversationId')
  getParticipants(
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    return this.service.getParticipantsByConversation(conversationId);
  }

  @Get('user/:userId')
  getUserConversations(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.getConversationsByUser(userId);
  }

  @Delete()
  remove(@Body() dto: DeleteConversationUserDto) {
    return this.service.removeParticipant(dto);
  }
}
