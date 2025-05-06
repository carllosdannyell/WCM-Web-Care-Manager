import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../user/user.entity';
import { Conversation } from '../conversation/conversation.entity';
import { ConversationUser } from 'src/conversation-user/conversation-user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(ConversationUser)
    private readonly conversationUserRepo: Repository<ConversationUser>,

    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    const { conversation_id, sender_id } = dto;

    const isMember = await this.conversationUserRepo.findOne({
      where: {
        conversation: { id: conversation_id },
        user: { id: sender_id },
      },
    });

    if (!isMember) {
      throw new ForbiddenException('Você não faz parte dessa conversa');
    }

    const user = await this.userRepo.findOneBy({ id: dto.sender_id });
    if (!user) throw new NotFoundException('Usuário remetente não encontrado');

    const conversation = await this.conversationRepo.findOneBy({
      id: dto.conversation_id,
    });
    if (!conversation) throw new NotFoundException('Conversa não encontrada');

    const message = this.messageRepo.create({
      sender: user,
      conversation,
      content: dto.content,
    });

    return this.messageRepo.save(message);
  }

  async findByConversation(
    conversationId: number,
    requesterId: number,
  ): Promise<Message[]> {
    const isMember = await this.conversationUserRepo.findOneBy({
      conversation: { id: conversationId },
      user: { id: requesterId },
    });

    if (!isMember) {
      throw new ForbiddenException('Você não faz parte dessa conversa');
    }

    return this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      relations: ['sender'],
      order: { sent_at: 'ASC' },
    });
  }
}
