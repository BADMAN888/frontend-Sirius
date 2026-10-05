import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Subject, switchMap } from 'rxjs';
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
  private readonly dateChange$ = new Subject<string>();

  reservations: ReservationCheckIn[] = [];

  selectedDate = this.formatDate(new Date());

  loading = false;
  error = '';

  checkingInId: number | null = null;

  ngOnInit(): void {
    this.dateChange$
      .pipe(
        switchMap(date => {
          this.loading = true;
          this.error = '';

          return this.reservationService.getCheckIns(date);
        })
      )
      .subscribe({
        next: reservations => {
          this.reservations = reservations;
          this.loading = false;
        },
        error: error => {
          this.reservations = [];
          this.loading = false;

          this.error =
            error?.error?.message ||
            error?.message ||
            `Failed to load check-ins. HTTP ${error?.status || ''}`;
        }
      });

    this.dateChange$.next(this.selectedDate);
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedDate = input.value;

    this.dateChange$.next(this.selectedDate);
  }

  checkIn(reservation: ReservationCheckIn): void {
    if (this.checkingInId !== null) {
      return;
    }

    this.checkingInId = reservation.id;
    this.error = '';

    this.reservationService
      .checkIn(reservation.id)
      .subscribe({
        next: () => {
          this.checkingInId = null;
          this.dateChange$.next(this.selectedDate);
        },
        error: error => {
          this.checkingInId = null;

          this.error =
            error?.error?.message ||
            error?.message ||
            `Failed to check in reservation. HTTP ${error?.status || ''}`;
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

