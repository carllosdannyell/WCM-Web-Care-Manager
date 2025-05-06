import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { User } from 'src/user/user.entity';
import { ConversationUser } from 'src/conversation-user/conversation-user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(ConversationUser)
    private readonly cuRepo: Repository<ConversationUser>,
  ) {}

  async create(dto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.conversationRepo.create({
      is_group: dto.is_group,
      name: dto.name,
    });

    const saved = await this.conversationRepo.save(conversation);

    const users = await this.userRepo.findBy({ id: In(dto.user_ids) });

    if (users.length !== dto.user_ids.length) {
      throw new BadRequestException('Um ou mais usuários não encontrados');
    }

    const participants = users.map((user) =>
      this.cuRepo.create({ conversation: saved, user }),
    );

    await this.cuRepo.save(participants);
    return saved;
  }

  findAll(): Promise<Conversation[]> {
    return this.conversationRepo.find({
      relations: ['participants', 'participants.user'],
    });
  }

  async findOne(id: number): Promise<Conversation> {
    const conversation = await this.conversationRepo.findOne({
      where: { id },
      relations: ['participants', 'participants.user', 'messages'],
    });
    if (!conversation) {
      throw new NotFoundException(`Conversa com id ${id} não encontrada`);
    }
    return conversation;
  }

  async update(id: number, dto: UpdateConversationDto): Promise<Conversation> {
    const conversation = await this.conversationRepo.findOneBy({ id });
    if (!conversation) {
      throw new NotFoundException(`Conversa com id ${id} não encontrada`);
    }
    await this.conversationRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.conversationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Identidade com id ${id} não encontrada`);
    }
    return { message: `Identidade com ID ${id} removido com sucesso` };
  }
}
