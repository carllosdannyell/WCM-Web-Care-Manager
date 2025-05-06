import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messageService.create(dto);
  }

  @Get('conversation/:conversationId')
  getMessagesByConversation(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Query('userId', ParseIntPipe) requesterId: number,
  ) {
    return this.messageService.findByConversation(conversationId, requesterId);
  }
}
