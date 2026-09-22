import { Component, OnInit, inject } from '@angular/core';
import {
  RoomResponse,
  RoomService
} from '../../core/services/room.service';
import {
  ReservationResponse,
  ReservationService
} from '../../core/services/reservation.service';

interface GridDate {
  iso: string;
  day: string;
  weekday: string;
}

@Component({
  selector: 'app-hotel-grid',
  standalone: true,
  templateUrl: './hotel-grid.html',
  styleUrl: './hotel-grid.scss'
})
export class HotelGrid implements OnInit {
  private readonly roomService = inject(RoomService);
  private readonly reservationService = inject(ReservationService);

  readonly hotelId = 1;

  readonly dates: GridDate[] = [
    {
      iso: '2026-09-22',
      day: '22',
      weekday: 'Tue'
    },
    {
      iso: '2026-09-23',
      day: '23',
      weekday: 'Wed'
    },
    {
      iso: '2026-09-24',
      day: '24',
      weekday: 'Thu'
    },
    {
      iso: '2026-09-25',
      day: '25',
      weekday: 'Fri'
    },
    {
      iso: '2026-09-26',
      day: '26',
      weekday: 'Sat'
    },
    {
      iso: '2026-09-27',
      day: '27',
      weekday: 'Sun'
    },
    {
      iso: '2026-09-28',
      day: '28',
      weekday: 'Mon'
    }
  ];

  rooms: RoomResponse[] = [];
  reservations: ReservationResponse[] = [];

  loading = true;
  error = '';

  selectedCategory = 'ALL';

  readonly categoryNames: Record<number, string> = {
    1: 'Standard',
    2: 'Superior',
    3: 'Junior Suite',
    4: 'Suite',
    5: 'Kozyn Corner'
  };

  readonly categories = [
    'Standard',
    'Superior',
    'Junior Suite',
    'Suite',
    'Kozyn Corner'
  ];

  ngOnInit(): void {
    this.loadGrid();
  }

  loadGrid(): void {
    this.loading = true;
    this.error = '';

    this.roomService.getByHotelId(this.hotelId).subscribe({
      next: rooms => {
        this.rooms = rooms;

        this.loadReservations();
      },
      error: error => {
        console.error(error);
        this.loading = false;
        this.error = 'Failed to load hotel rooms.';
      }
    });
  }

  private loadReservations(): void {
    this.reservationService.getAll().subscribe({
      next: reservations => {
        this.reservations = reservations;
        this.loading = false;
      },
      error: error => {
        console.error(error);
        this.loading = false;
        this.error = 'Failed to load reservations.';
      }
    });
  }

  get filteredRooms(): RoomResponse[] {
    if (this.selectedCategory === 'ALL') {
      return this.rooms;
    }

    return this.rooms.filter(
      room => this.getCategoryName(room.categoryId) === this.selectedCategory
    );
  }

  getCategoryName(categoryId: number): string {
    return this.categoryNames[categoryId] ?? `Category ${categoryId}`;
  }

  getBooking(
    roomId: number,
    date: string
  ): ReservationResponse | null {
    return this.reservations.find(reservation =>
      reservation.roomId === roomId &&
      date >= reservation.checkInDate &&
      date < reservation.checkOutDate
    ) ?? null;
  }

  isCheckIn(roomId: number, date: string): boolean {
    return this.reservations.some(reservation =>
      reservation.roomId === roomId &&
      reservation.checkInDate === date
    );
  }

  isCheckOut(roomId: number, date: string): boolean {
    return this.reservations.some(reservation =>
      reservation.roomId === roomId &&
      reservation.checkOutDate === date
    );
  }

  getGuestName(reservation: ReservationResponse): string {
    const guest = reservation.guests?.[0];

    if (!guest) {
      return reservation.confirmationNumber;
    }

    return `${guest.firstName} ${guest.lastName}`;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  onCellClick(room: RoomResponse, date: GridDate): void {
    const booking = this.getBooking(room.id, date.iso);

    if (booking) {
      console.log('Reservation:', booking);
      return;
    }

    console.log('Create reservation:', {
      roomId: room.id,
      roomNumber: room.roomNumber,
      date: date.iso
    });
  }
}
