// src/app/pages/chat/chat.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import {
  ChatService,
  User,
  Message,
  // Chat
} from './chat.service';

interface JwtPayload {
  id: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  users: User[] = [];
  loading = false;
  currentUserId = 0;

  // Novas propriedades para a conversa
  selectedUser: User | null = null;
  selectedChatId: number | null = null;
  messages: Message[] = [];
  newMessage = '';

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {
    this.currentUserId = this.getCurrentUserId();
    if (!this.currentUserId) {
      console.error('Não foi possível determinar o usuário atual!');
      return;
    }
    this.fetchUsers();
  }

  private fetchUsers(): void {
    this.chatService.getUsers().subscribe({
      next: (list) => {
        this.users = list.filter((u) => u.id !== this.currentUserId);
      },
      error: (err) => console.error('Erro ao buscar usuários:', err),
    });
  }

  startConversation(user: User): void {
    this.loading = true;
    this.chatService.getOrCreateChat(this.currentUserId, user.id).subscribe({
      
      next: (chat: any) => {
        this.selectedUser = user;
        this.selectedChatId = chat.id;
        this.loadMessages(chat.id);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao iniciar conversa:', err);
      },
    });
  }

  private loadMessages(chatId: number): void {
    this.chatService.getMessages(chatId).subscribe({
      next: (msgs) => (this.messages = msgs),
      error: (err) => console.error('Erro ao carregar mensagens:', err),
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || this.selectedChatId == null) {
      return;
    }
    const content = this.newMessage.trim();
    this.chatService
      .sendMessage(this.selectedChatId, this.currentUserId, content)
      .subscribe({
        next: (msg) => {
          this.messages.push(msg);
          this.newMessage = '';
        },
        error: (err) => console.error('Erro ao enviar mensagem:', err),
      });
  }

  private getCurrentUserId(): number {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('token não encontrado');
      return 0;
    }
    try {
      const payload = jwtDecode<JwtPayload>(token);
      return payload.id || 0;
    } catch (e) {
      console.error('Falha ao decodificar JWT:', e);
      return 0;
    }
  }
}
