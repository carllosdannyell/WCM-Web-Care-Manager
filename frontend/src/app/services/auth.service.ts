import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface IPayload {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) {}

  async login(email: string, password: string): Promise<Observable<any>> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        catchError((error) => {
          console.error('Erro no login:', error);
          return throwError(() => new Error('Credenciais inválidas'));
        })
      );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getCurrentUserId(): number {
    const token = this.getToken();
    if (!token) {
      return 0;
    }
    try {
      const payload = jwtDecode<IPayload>(token);
      return payload.id || 0;
    } catch (e) {
      console.error('Falha ao decodificar JWT:', e);
      return 0;
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}

/* 
// src/app/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface JwtPayload {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private loggedIn = false;
  private apiUrl = 'http://localhost:3000';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
    private http: HttpClient
  ) {
    // Inicializa o estado de login de forma síncrona
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      this.loggedIn = !!token;
    }
  }

  async login(email: string, password: string): Promise<Observable<any>> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        catchError((error) => {
          console.error('Erro no login:', error);
          return throwError(() => new Error('Credenciais inválidas'));
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getCurrentUserId(): number {
    const token = this.getToken();
    if (!token) {
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

*/