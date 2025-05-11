// src/app/pages/chat/chat.component.ts
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { ChatService, User, Message } from './chat.service';

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
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageList', { static: false })
  private messageList?: ElementRef<HTMLDivElement>;

  users: User[] = [];
  loading = false;
  currentUserId = 0;

  selectedUser: User | null = null;
  selectedChatId: number | null = null;
  messages: Message[] = [];
  newMessage = '';

  /** flag que indica quando devemos rolar para o fim */
  private shouldScroll = false;

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

  /** chamado após cada renderização */
  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
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
      next: (msgs) => {
        this.messages = msgs;
        // marca para rolar só uma vez, após a view ser atualizada
        this.shouldScroll = true;
      },
      error: (err) => console.error('Erro ao carregar mensagens:', err),
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || this.selectedChatId === null) {
      return;
    }
    const content = this.newMessage.trim();
    this.chatService
      .sendMessage(this.selectedChatId, this.currentUserId, content)
      .subscribe({
        next: (msg) => {
          this.messages.push(msg);
          this.newMessage = '';
          // sinaliza para rolar após o Angular renderizar
          this.shouldScroll = true;
        },
        error: (err) => console.error('Erro ao enviar mensagem:', err),
      });
  }

  private scrollToBottom(): void {
    if (!this.messageList) {
      return;
    }
    // espera um tick para garantir que o DOM já foi atualizado
    setTimeout(() => {
      try {
        const el = this.messageList!.nativeElement;
        el.scrollTop = el.scrollHeight;
      } catch (err) {
        console.warn('Erro ao rolar mensagens:', err);
      }
    }, 0);
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
