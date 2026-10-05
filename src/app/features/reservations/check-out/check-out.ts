import {DatePipe, DecimalPipe} from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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

  reservations: ReservationCheckOut[] = [];

  selectedDate = this.formatDate(new Date());

  loading = false;
  error = '';

  checkingOutId: number | null = null;

  ngOnInit(): void {
    this.loadCheckOuts();
  }

  loadCheckOuts(): void {
    this.loading = true;
    this.error = '';

    this.reservationService
      .getCheckOuts(this.selectedDate)
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
            `Failed to load check-outs. HTTP ${error?.status || ''}`;
        }
      });
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedDate = input.value;

    this.loadCheckOuts();
  }

  checkOut(reservation: ReservationCheckOut): void {
    if (this.checkingOutId !== null) {
      return;
    }

    this.checkingOutId = reservation.id;
    this.error = '';

    this.reservationService
      .checkOut(reservation.id)
      .subscribe({
        next: () => {
          this.checkingOutId = null;
          this.loadCheckOuts();
        },
        error: error => {
          this.checkingOutId = null;

          this.error =
            error?.error?.message ||
            error?.message ||
            `Failed to check out reservation. HTTP ${error?.status || ''}`;
        }
      });
  }

  formatTime(value: string): string {
    const date = new Date(value);

    return date.toLocaleTimeString(
      'uk-UA',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }

  getCommentText(reservation: ReservationCheckOut): string {
    return reservation.comments
      ?.map(comment => comment.text)
      .join(', ') || '—';
  }

  getRoomNumber(roomId: number): string {
    return String(roomId);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
