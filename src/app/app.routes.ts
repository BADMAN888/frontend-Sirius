import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/layout/main-layout/main-layout').then(
        m => m.MainLayout
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(
            m => m.Dashboard
          )
      },
      {
        path: 'hotel-grid',
        loadComponent: () =>
          import('./features/hotel-grid/hotel-grid').then(
            m => m.HotelGrid
          )
      },
      {
        path: 'reservations/check-in',
        loadComponent: () =>
          import('./features/reservations/check-in/check-in').then(
            m => m.CheckIn
          )
      },
      {
        path: 'reservations/check-out',
        loadComponent: () =>
          import('./features/reservations/check-out/check-out').then(
            m => m.CheckOut
          )
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

