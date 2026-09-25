import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'access_token';
  private readonly apiUrl = 'http://localhost:8080/auth';

  readonly isAuthenticated = signal(this.hasValidToken());

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          this.setToken(response.token);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticated.set(true);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  hasValidToken(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    if (this.isTokenExpired(token)) {
      this.clearToken();
      return false;
    }

    return true;
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];

      if (!payload) {
        return true;
      }

      const decodedPayload = JSON.parse(
        atob(
          payload
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        )
      );

      if (!decodedPayload.exp) {
        return true;
      }

      return decodedPayload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
