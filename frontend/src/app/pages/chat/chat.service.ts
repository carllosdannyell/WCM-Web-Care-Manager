// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Conversation {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationUser {
  conversationId: number;
  userId: number;
  joinedAt: string;
}

export interface Message {
  id: number;
  content: string;
  sentAt: string;
  isRead: boolean;
  conversationId: number;
  sender: {
    id: number;
    name: string;
    email: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /** 1) Lista todos os usuários */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  /**
   * 2) Cria uma conversa nova enviando já os participantes
   *    conforme o seu CreateConversationDto (is_group + user_ids)
   */
  private createConversation(a: number, b: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.apiUrl}/conversations`, {
      is_group: false,
      user_ids: [a, b],
    });
  }

  /** 3) Busca todas as associações de conversa para um dado usuário */
  private getConversationUsersForUser(
    userId: number
  ): Observable<ConversationUser[]> {
    return this.http.get<ConversationUser[]>(
      `${this.apiUrl}/conversation-user/user/${userId}`
    );
  }

  /**
   * 4) Checa se já existe conversa privada entre A e B,
   *    retornando a Conversation ou null.
   */
  private checkConversationExists(
    a: number,
    b: number
  ): Observable<Conversation | null> {
    return forkJoin([
      this.getConversationUsersForUser(a),
      this.getConversationUsersForUser(b),
    ]).pipe(
      map(
        ([listA, listB]) =>
          // procura um conversationId em comum
          listA
            .map((cu) => cu.conversationId)
            .find((id) => listB.some((cu2) => cu2.conversationId === id)) ??
          null
      ),
      switchMap((convId) =>
        convId
          ? // se encontrou, busca detalhes da conversa
            this.http.get<Conversation>(
              `${this.apiUrl}/conversations/${convId}`
            )
          : of(null)
      )
    );
  }

  /**
   * 5) Retorna a conversa existente ou cria uma nova (com participantes)
   */
  getOrCreateChat(a: number, b: number): Observable<Conversation> {
    return this.checkConversationExists(a, b).pipe(
      switchMap((conv) =>
        conv
          ? // já existe → emite direto
            of(conv)
          : // não existe → chama seu POST /conversations
            this.createConversation(a, b)
      )
    );
  }

  /**
   * 6) Busca mensagens de uma conversa.
   *    Passa o userId como query param para satisfazer o seu @Query('userId')
   */
  getMessages(conversationId: number): Observable<Message[]> {
    const userId = this.authService.getCurrentUserId();
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<Message[]>(
      `${this.apiUrl}/messages/conversation/${conversationId}`,
      { params }
    );
  }

  /**
   * 7) Envia uma nova mensagem no formato esperado pelo CreateMessageDto
   */
  sendMessage(
    conversationId: number,
    senderId: number,
    content: string
  ): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages`, {
      conversation_id: conversationId,
      sender_id: senderId,
      content: content,
    });
  }
}
