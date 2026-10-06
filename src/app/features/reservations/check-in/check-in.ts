import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ReservationService } from '../../../core/services/reservation.service';
import { ReservationCheckIn } from '../../../core/models/reservation/reservation-check-in.model';

@Component({
  selector: 'app-check-in',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './check-in.html',
  styleUrl: './check-in.scss'
})
export class CheckIn implements OnInit {
  private readonly reservationService = inject(ReservationService);

  readonly reservations = signal<ReservationCheckIn[]>([]);
  readonly selectedDate = signal(this.formatDate(new Date()));
  readonly loading = signal(false);
  readonly error = signal('');

  checkingInId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadCheckIns();
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedDate.set(input.value);

    this.loadCheckIns();
  }

  private loadCheckIns(): void {
    this.loading.set(true);
    this.error.set('');

    this.reservationService
      .getCheckIns(this.selectedDate())
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
            `Failed to load check-ins. HTTP ${error?.status || ''}`
          );
        }
      });
  }

  checkIn(reservation: ReservationCheckIn): void {
    if (this.checkingInId() !== null) {
      return;
    }

    this.checkingInId.set(reservation.id);
    this.error.set('');

    this.reservationService
      .checkIn(reservation.id)
      .pipe(
        finalize(() => {
          this.checkingInId.set(null);
        })
      )
      .subscribe({
        next: () => {
          this.loadCheckIns();
        },
        error: error => {
          this.error.set(
            error?.error?.message ||
            error?.message ||
            `Failed to check in reservation. HTTP ${error?.status || ''}`
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

  getCommentText(reservation: ReservationCheckIn): string {
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
