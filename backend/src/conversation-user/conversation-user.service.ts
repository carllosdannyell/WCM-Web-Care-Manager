import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationUser } from './conversation-user.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Conversation } from '../conversation/conversation.entity';
import { CreateConversationUserDto } from './dto/create-conversation-user.dto';
import { DeleteConversationUserDto } from './dto/delete-conversation-user.dto';

@Injectable()
export class ConversationUserService {
  constructor(
    @InjectRepository(ConversationUser)
    private readonly conversationUserRepo: Repository<ConversationUser>,

    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async addParticipant(
    dto: CreateConversationUserDto,
  ): Promise<ConversationUser> {
    const conversation = await this.conversationRepo.findOneBy({
      id: dto.conversation_id,
    });
    if (!conversation) throw new NotFoundException('Conversa não encontrada');

    const user = await this.userRepo.findOneBy({ id: dto.user_id });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const exists = await this.conversationUserRepo.findOne({
      where: {
        conversation: { id: dto.conversation_id },
        user: { id: dto.user_id },
      },
    });

    if (exists) {
      throw new BadRequestException('Usuário já participa da conversa');
    }

    const participant = this.conversationUserRepo.create({
      conversation,
      user,
    });

    return this.conversationUserRepo.save(participant);
  }

  async getParticipantsByConversation(conversationId: number): Promise<User[]> {
    const participants = await this.conversationUserRepo.find({
      where: { conversation: { id: conversationId } },
      relations: ['user'],
    });

    return participants.map((cu) => cu.user);
  }

  async getConversationsByUser(userId: number): Promise<Conversation[]> {
    const records = await this.conversationUserRepo.find({
      where: { user: { id: userId } },
      relations: ['conversation'],
    });

    return records.map((cu) => cu.conversation);
  }

  async removeParticipant(
    dto: DeleteConversationUserDto,
  ): Promise<{ message: string }> {
    const record = await this.conversationUserRepo.findOne({
      where: {
        conversation: { id: dto.conversation_id },
        user: { id: dto.user_id },
      },
    });

    if (!record) {
      throw new NotFoundException('Participação não encontrada');
    }

    await this.conversationUserRepo.delete(record.id);
    return { message: 'Usuário removido da conversa com sucesso' };
  }
}
