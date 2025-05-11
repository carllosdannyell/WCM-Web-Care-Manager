/* eslint-disable @typescript-eslint/no-unused-vars */
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

  async create(dto: CreateConversationDto): Promise<Conversation | null> {
    const { is_group, name, user_ids } = dto;

    // 1) Se for 1-a-1, tenta encontrar conversa existente
    if (!is_group && user_ids.length === 2) {
      // busca todas as associações de ambos
      const existingCUs = await this.cuRepo.find({
        where: { user: In(user_ids) },
        relations: ['conversation'],
      });

      // conta quantos participantes cada conversa tem em comum
      const counts: Record<number, number> = {};
      for (const cu of existingCUs) {
        const cid = cu.conversation.id;
        counts[cid] = (counts[cid] || 0) + 1;
      }
      const existingId = Number(
        Object.entries(counts).find(([cid, cnt]) => cnt === 2)?.[0] ?? null,
      );
      if (existingId) {
        // retorna já carregada
        return this.conversationRepo.findOne({
          where: { id: existingId },
        });
      }
    }

    // 2) Não achou: cria nova conversa
    const convEntity = this.conversationRepo.create({
      is_group,
      name,
    });
    const saved = await this.conversationRepo.save(convEntity);

    // valida usuários
    const users = await this.userRepo.findBy({ id: In(user_ids) });
    if (users.length !== user_ids.length) {
      throw new BadRequestException('Algum usuário não encontrado');
    }

    // cria associações: passe apenas os IDs, não entidades completas
    const participants = users.map((u) =>
      this.cuRepo.create({
        conversation: { id: saved.id }, // ← só precisa do id
        user: { id: u.id }, // ← só precisa do id
      }),
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
