import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CheckTokensResponse } from '../models/token-session.model';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  sub: string;
  displayName?: string;
  email?: string;
  groups: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authBaseUrl = environment.authBaseUrl;

  // Primary Token Signals
  accessToken = signal<string | null>(localStorage.getItem('access_token'));
  refreshToken = signal<string | null>(localStorage.getItem('refresh_token'));
  isRefreshing = signal<boolean>(false);

  // In-flight refresh promise lock
  private refreshPromise: Promise<string | null> | null = null;

  // Computed Signal: Decodes User Profile from JWT Claims
  currentUser = computed<UserProfile | null>(() => {
    const token = this.accessToken();
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      const payload = JSON.parse(jsonPayload);

      return {
        sub: payload.sub,
        displayName: payload.displayName || payload.sub,
        email: payload.email || null,
        groups: payload.groups || [],
      };
    } catch {
      return null;
    }
  });

  // Computed Signal: Evaluates Authentication State
  isAuthenticated = computed<boolean>(() => !!this.accessToken());

  constructor() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'access_token') this.accessToken.set(event.newValue);
      if (event.key === 'refresh_token') this.refreshToken.set(event.newValue);
    });
  }

  // Programmatic Login for Credentials Form
  login(credentials: { username: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.authBaseUrl}/api/auth/login`, credentials).pipe(
      tap((res) => {
        this.setTokens(res.accessToken, res.refreshToken);
        this.router.navigate(['/']);
      }),
    );
  }

  // Redirect Helper for OAuth Server (Separate method)
  redirectToAuthServer() {
    window.location.href = `${environment.authBaseUrl}/oauth2/authorization/gateway`;
  }

  logout() {
    const token = this.refreshToken();
    if (token) {
      this.http.post(`${this.authBaseUrl}/api/auth/logout`, { refreshToken: token }).subscribe();
    }
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  // Promise-based Mutex Refresh Lock
  async refreshTokenLock(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing.set(true);

    this.refreshPromise = (async () => {
      try {
        const token = this.refreshToken();
        if (!token) throw new Error('No refresh token available');

        const res = await firstValueFrom(
          this.http.post<AuthResponse>(`${this.authBaseUrl}/api/auth/refresh`, {
            refreshToken: token,
          }),
        );

        this.setTokens(res.accessToken, res.refreshToken);
        return res.accessToken;
      } catch {
        this.logout();
        return null;
      } finally {
        this.isRefreshing.set(false);
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private setTokens(access: string, refresh: string) {
    this.accessToken.set(access);
    this.refreshToken.set(refresh);
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  private clearTokens() {
    this.accessToken.set(null);
    this.refreshToken.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getValidTokens() {
    return this.http.get<CheckTokensResponse>(`${environment.authBaseUrl}/api/auth/checktokens`);
  }
}
