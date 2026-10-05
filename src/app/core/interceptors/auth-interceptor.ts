import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AuthResponse } from '../models/auth/auth-response.model';

let refreshRequest$: Observable<AuthResponse> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isAuthRequest = req.url.includes('/auth/');

  if (isAuthRequest) {
    return next(req);
  }

  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError(error => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = authService.getRefreshToken();

      if (!refreshToken) {
        authService.logout();
        return throwError(() => error);
      }

      if (!refreshRequest$) {
        refreshRequest$ = authService.refresh().pipe(
          shareReplay(1),
          finalize(() => {
            refreshRequest$ = null;
          })
        );
      }

      return refreshRequest$.pipe(
        switchMap(response => {
          const retryRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.token}`
            }
          });

          return next(retryRequest);
        }),
        catchError(refreshError => {
          authService.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
