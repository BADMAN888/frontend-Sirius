import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HotelGridService } from '../../core/services/hotel-grid.service';
import { HotelGridRoom } from '../../core/models/hotel-grid/hotel-grid-room.model';
import { HotelGridReservation } from '../../core/models/hotel-grid/hotel-grid-reservation.model';

@Component({
  selector: 'app-hotel-grid',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './hotel-grid.html',
  styleUrl: './hotel-grid.scss'
})
export class HotelGrid implements OnInit {
  private readonly hotelGridService =
    inject(HotelGridService);

  readonly dayWidth = 92;
  readonly roomColumnWidth = 150;
  readonly numberOfDays = 31;

  days: Date[] = [];
  rooms: HotelGridRoom[] = [];

  loading = true;
  error = '';

  private gridStart!: Date;
  private gridEnd!: Date;

  ngOnInit(): void {
    this.initializeDays();
    this.loadGrid();
  }

  private initializeDays(): void {
    const today = new Date();

    this.gridStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    this.gridEnd = this.addDays(
      this.gridStart,
      this.numberOfDays
    );

    this.days = Array.from(
      { length: this.numberOfDays },
      (_, index) =>
        this.addDays(this.gridStart, index)
    );
  }

  private loadGrid(): void {
    this.loading = true;
    this.error = '';

    const startDate =
      this.formatDate(this.gridStart);

    const endDate =
      this.formatDate(this.gridEnd);

    this.hotelGridService
      .getGrid(startDate, endDate)
      .subscribe({
        next: response => {
          this.rooms = response.rooms;
          this.loading = false;
        },
        error: error => {
          console.error(
            'Hotel grid error:',
            error
          );

          this.error =
            error?.error?.message ||
            error?.message ||
            `Failed to load hotel grid. HTTP ${error?.status || ''}`;

          this.loading = false;
        }
      });
  }

  getReservationsForRoom(
    room: HotelGridRoom
  ): HotelGridReservation[] {
    return room.reservations;
  }

  getReservationLeft(
    reservation: HotelGridReservation
  ): number {
    const checkIn =
      this.parseDate(reservation.checkInDate);

    const visibleStart =
      checkIn < this.gridStart
        ? this.gridStart
        : checkIn;

    const offset =
      this.getDaysBetween(
        this.gridStart,
        visibleStart
      );

    return (
      this.roomColumnWidth +
      offset * this.dayWidth
    );
  }

  getReservationWidth(
    reservation: HotelGridReservation
  ): number {
    const checkIn =
      this.parseDate(reservation.checkInDate);

    const checkOut =
      this.parseDate(reservation.checkOutDate);

    const visibleStart =
      checkIn < this.gridStart
        ? this.gridStart
        : checkIn;

    const visibleEnd =
      checkOut > this.gridEnd
        ? this.gridEnd
        : checkOut;

    const visibleNights =
      this.getDaysBetween(
        visibleStart,
        visibleEnd
      );

    return Math.max(
      this.dayWidth - 6,
      visibleNights * this.dayWidth - 6
    );
  }

  getReservationLabel(
    reservation: HotelGridReservation
  ): string {
    return `${reservation.confirmationNumber} · ${reservation.status}`;
  }

  isToday(day: Date): boolean {
    return (
      this.formatDate(day) ===
      this.formatDate(new Date())
    );
  }

  private addDays(
    date: Date,
    days: number
  ): Date {
    const result = new Date(date);
    result.setDate(
      result.getDate() + days
    );

    return result;
  }

  private getDaysBetween(
    start: Date,
    end: Date
  ): number {
    const startUtc = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );

    const endUtc = Date.UTC(
      end.getFullYear(),
      end.getMonth(),
      end.getDate()
    );

    return Math.round(
      (endUtc - startUtc) /
      (1000 * 60 * 60 * 24)
    );
  }

  private parseDate(
    value: string
  ): Date {
    const [
      year,
      month,
      day
    ] = value
      .substring(0, 10)
      .split('-')
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  private formatDate(
    date: Date
  ): string {
    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
