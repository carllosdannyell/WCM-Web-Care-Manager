import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { Conversation } from '../conversation/conversation.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ConversationUser } from 'src/conversation-user/conversation-user.entity';
import { MessageGateway } from 'src/gateway/message.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Conversation, ConversationUser]),
  ],
  providers: [MessageService, MessageGateway],
  controllers: [MessageController],
})
export class MessageModule {}
