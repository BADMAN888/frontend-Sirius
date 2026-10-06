import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  readonly authService = inject(AuthService);
}
