import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationUser } from './conversation-user.entity';
import { ConversationUserService } from './conversation-user.service';
import { ConversationUserController } from './conversation-user.controller';
import { Conversation } from '../conversation/conversation.entity';
import { User } from '../user/user.entity';
import { Message } from 'src/message/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationUser, Conversation, User, Message]),
  ],
  providers: [ConversationUserService],
  controllers: [ConversationUserController],
})
export class ConversationUserModule {}
