import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ReservationCheckOut } from '../../../core/models/reservation/reservation-check-out.model';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './check-out.html',
  styleUrl: './check-out.scss'
})
export class CheckOut implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly router = inject(Router);

  readonly reservations = signal<ReservationCheckOut[]>([]);
  readonly selectedDate = signal(this.formatDate(new Date()));
  readonly loading = signal(false);
  readonly error = signal('');

  readonly checkingOutId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadCheckOuts();
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedDate.set(input.value);

    this.loadCheckOuts();
  }

  openReservation(id: number): void {
    this.router.navigate(['/reservations', id]);
  }

  private loadCheckOuts(): void {
    this.loading.set(true);
    this.error.set('');

    this.reservationService
      .getCheckOuts(this.selectedDate())
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: reservations => {
          this.reservations.set(reservations);
        },
        error: error => {
          this.reservations.set([]);

          this.error.set(
            error?.error?.message ||
            error?.message ||
            `Failed to load check-outs. HTTP ${error?.status || ''}`
          );
        }
      });
  }

  checkOut(reservation: ReservationCheckOut): void {
    if (this.checkingOutId() !== null) {
      return;
    }

    this.checkingOutId.set(reservation.id);
    this.error.set('');

    this.reservationService
      .checkOut(reservation.id)
      .pipe(
        finalize(() => {
          this.checkingOutId.set(null);
        })
      )
      .subscribe({
        next: () => {
          this.loadCheckOuts();
        },
        error: error => {
          this.error.set(
            error?.error?.message ||
            error?.message ||
            `Failed to check out reservation. HTTP ${error?.status || ''}`
          );
        }
      });
  }

  formatTime(value: string): string {
    return new Date(value).toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCommentText(reservation: ReservationCheckOut): string {
    return reservation.comments?.map(comment => comment.text).join(', ') || '—';
  }

  getRoomNumber(roomId: number): string {
    return String(roomId);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
