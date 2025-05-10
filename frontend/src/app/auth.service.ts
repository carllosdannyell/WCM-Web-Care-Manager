import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public authState = this.loggedIn.asObservable();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      this.loggedIn.next(!!token);
    }
  }

  login(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
    this.loggedIn.next(true);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}
