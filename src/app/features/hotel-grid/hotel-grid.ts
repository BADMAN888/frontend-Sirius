import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { HotelService } from '../../core/services/hotel.service';
import { RoomCategoryService } from '../../core/services/room-category.service';
import { RoomService } from '../../core/services/room.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Hotel } from '../../core/models/hotel/hotel.model';
import { RoomCategory } from '../../core/models/hotel/room-category.model';
import { Room } from '../../core/models/hotel/room.model';
import { Reservation } from '../../core/models/reservation/reservation.model';

interface GridDate {
  iso: string;
  day: string;
  weekday: string;
  isToday: boolean;
}

@Component({
  selector: 'app-hotel-grid',
  standalone: true,
  templateUrl: './hotel-grid.html',
  styleUrl: './hotel-grid.scss'
})
export class HotelGrid implements OnInit {
  private readonly hotelService = inject(HotelService);
  private readonly roomCategoryService = inject(RoomCategoryService);
  private readonly roomService = inject(RoomService);
  private readonly reservationService = inject(ReservationService);

  readonly hotelId = 1;
  readonly daysToShow = 14;

  hotel: Hotel | null = null;
  categories: RoomCategory[] = [];
  rooms: Room[] = [];
  reservations: Reservation[] = [];

  dates: GridDate[] = [];

  loading = true;
  error = '';

  selectedCategoryId: number | null = null;
  currentStartDate = this.startOfDay(new Date());

  ngOnInit(): void {
    this.generateDates();
    this.loadGrid();
  }

  private loadGrid(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      hotel: this.hotelService.getById(this.hotelId),
      categories: this.roomCategoryService.getByHotelId(this.hotelId),
      rooms: this.roomService.getByHotelId(this.hotelId),
      reservations: this.reservationService.getAll()
    }).subscribe({
      next: result => {
        this.hotel = result.hotel;
        this.categories = result.categories;
        this.rooms = result.rooms;
        this.reservations = result.reservations;
        this.loading = false;
      },
      error: error => {
        console.error(error);
        this.loading = false;
        this.error = 'Failed to load hotel grid.';
      }
    });
  }

  private generateDates(): void {
    this.dates = Array.from(
      { length: this.daysToShow },
      (_, index) => {
        const date = new Date(this.currentStartDate);

        date.setDate(
          this.currentStartDate.getDate() + index
        );

        return {
          iso: this.toIsoDate(date),
          day: String(date.getDate()),
          weekday: date.toLocaleDateString('en-US', {
            weekday: 'short'
          }),
          isToday: this.isToday(date)
        };
      }
    );
  }

  previousPeriod(): void {
    const date = new Date(this.currentStartDate);

    date.setDate(
      date.getDate() - this.daysToShow
    );

    this.currentStartDate = date;
    this.generateDates();
  }

  nextPeriod(): void {
    const date = new Date(this.currentStartDate);

    date.setDate(
      date.getDate() + this.daysToShow
    );

    this.currentStartDate = date;
    this.generateDates();
  }

  today(): void {
    this.currentStartDate = this.startOfDay(new Date());
    this.generateDates();
  }

  private startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  private isToday(date: Date): boolean {
    const today = this.startOfDay(new Date());

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  get filteredRooms(): Room[] {
    const rooms = this.selectedCategoryId === null
      ? [...this.rooms]
      : this.rooms.filter(
        room => room.categoryId === this.selectedCategoryId
      );

    return rooms.sort((a, b) => {
      if (a.floor !== b.floor) {
        return a.floor - b.floor;
      }

      return a.roomNumber.localeCompare(
        b.roomNumber,
        undefined,
        { numeric: true }
      );
    });
  }

  get visibleCategories(): RoomCategory[] {
    if (this.selectedCategoryId === null) {
      return this.categories;
    }

    return this.categories.filter(
      category => category.id === this.selectedCategoryId
    );
  }

  getRoomsForCategory(categoryId: number): Room[] {
    return this.filteredRooms.filter(
      room => room.categoryId === categoryId
    );
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find(
      category => category.id === categoryId
    )?.name ?? `Category ${categoryId}`;
  }

  getVisibleReservations(roomId: number): Reservation[] {
    return this.reservations
      .filter(reservation =>
        reservation.roomId === roomId &&
        reservation.status !== 'CANCELLED' &&
        reservation.status !== 'NO_SHOW' &&
        this.reservationIntersectsView(reservation)
      )
      .sort((a, b) =>
        a.checkInDate.localeCompare(b.checkInDate)
      );
  }

  private reservationIntersectsView(
    reservation: Reservation
  ): boolean {
    const viewStart = this.dates[0]?.iso;
    const viewEnd = this.dates[this.dates.length - 1]?.iso;

    if (!viewStart || !viewEnd) {
      return false;
    }

    return (
      reservation.checkOutDate > viewStart &&
      reservation.checkInDate <= viewEnd
    );
  }

  getReservationColumn(
    reservation: Reservation
  ): string {
    const startIndex = this.getReservationStartIndex(reservation);
    const endIndex = this.getReservationEndIndex(reservation);

    const start = Math.max(startIndex, 0);
    const end = Math.min(
      endIndex,
      this.daysToShow
    );

    const span = Math.max(end - start, 1);

    return `${start + 1} / span ${span}`;
  }

  private getReservationStartIndex(
    reservation: Reservation
  ): number {
    return this.getDateDifference(
      this.dates[0].iso,
      reservation.checkInDate
    );
  }

  private getReservationEndIndex(
    reservation: Reservation
  ): number {
    return this.getDateDifference(
      this.dates[0].iso,
      reservation.checkOutDate
    );
  }

  private getDateDifference(
    from: string,
    to: string
  ): number {
    const fromDate = this.parseIsoDate(from);
    const toDate = this.parseIsoDate(to);

    return Math.round(
      (
        toDate.getTime() -
        fromDate.getTime()
      ) / 86400000
    );
  }

  private parseIsoDate(value: string): Date {
    const [year, month, day] = value
      .split('-')
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  getReservationStatusClass(
    reservation: Reservation
  ): string {
    return reservation.status.toLowerCase().replace('_', '-');
  }

  isReservationCheckInVisible(
    reservation: Reservation
  ): boolean {
    return (
      reservation.checkInDate >= this.dates[0].iso &&
      reservation.checkInDate <=
      this.dates[this.dates.length - 1].iso
    );
  }

  isReservationCheckOutVisible(
    reservation: Reservation
  ): boolean {
    return (
      reservation.checkOutDate >= this.dates[0].iso &&
      reservation.checkOutDate <=
      this.dates[this.dates.length - 1].iso
    );
  }

  getReservationLabel(
    reservation: Reservation
  ): string {
    return reservation.confirmationNumber;
  }

  getReservationDates(
    reservation: Reservation
  ): string {
    return `${reservation.checkInDate} → ${reservation.checkOutDate}`;
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
  }

  onReservationClick(
    reservation: Reservation
  ): void {
    console.log('Reservation:', reservation);
  }

  onCellClick(
    room: Room,
    date: GridDate
  ): void {
    console.log('Create reservation:', {
      roomId: room.id,
      roomNumber: room.roomNumber,
      date: date.iso
    });
  }
}
