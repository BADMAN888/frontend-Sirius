import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Reservation } from '../../core/models/reservation/reservation.model';
import { ReservationStatus } from '../../core/models/reservation/reservation-status.enum';
import { Room } from '../../core/models/hotel/room.model';
import { Rate } from '../../core/models/billing/rate.model';
import { Profile } from '../../core/models/reservation/profile.model';
import { ReservationService } from '../../core/services/reservation.service';
import { RoomService } from '../../core/services/room.service';
import { RateService } from '../../core/services/rate.service';
import { ProfileService } from '../../core/services/profile.service';
import {
  RoomCategory,
  RoomCategoryService
} from '../../core/services/room-category.service';

interface ReservationRow {
  reservation: Reservation;
  room?: Room;
  rate?: Rate;
  guest?: Profile;
  category?: RoomCategory;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule
  ],
  templateUrl: './reservations.html',
  styleUrl: './reservations.scss'
})
export class Reservations implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly roomService = inject(RoomService);
  private readonly rateService = inject(RateService);
  private readonly profileService = inject(ProfileService);
  private readonly roomCategoryService = inject(RoomCategoryService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly statuses = Object.values(ReservationStatus);

  rows: ReservationRow[] = [];

  loading = true;
  error = '';

  search = '';
  statusFilter = 'ALL';

  actionLoadingId: number | null = null;

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      reservations: this.reservationService.getAll(),
      rooms: this.roomService.getAll(),
      rates: this.rateService.getAll(),
      profiles: this.profileService.getAll(),
      categories: this.roomCategoryService.getAll()
    }).subscribe({
      next: data => {
        const rooms = new Map(
          data.rooms.map(room => [room.id, room])
        );

        const rates = new Map(
          data.rates.map(rate => [rate.id, rate])
        );

        const profiles = new Map(
          data.profiles.map(profile => [profile.id, profile])
        );

        const categories = new Map(
          data.categories.map(category => [category.id, category])
        );

        this.rows = data.reservations.map(reservation => {
          const room = rooms.get(reservation.roomId);

          return {
            reservation,
            room,
            rate: rates.get(reservation.rateId),
            guest: profiles.get(reservation.primaryGuestId),
            category: room
              ? categories.get(room.categoryId)
              : undefined
          };
        });

        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: error => {
        this.rows = [];
        this.loading = false;
        this.error =
          error?.error?.message ||
          error?.message ||
          `Failed to load reservations. HTTP ${error?.status || ''}`;

        this.changeDetectorRef.detectChanges();
      }
    });
  }

  get filteredRows(): ReservationRow[] {
    const search = this.search.trim().toLowerCase();

    return this.rows.filter(row => {
      const reservation = row.reservation;
      const guest = row.guest;

      const matchesStatus =
        this.statusFilter === 'ALL' ||
        reservation.status === this.statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!search) {
        return true;
      }

      const values = [
        reservation.confirmationNumber,
        row.room?.roomNumber,
        row.category?.name,
        row.rate?.name,
        guest?.firstName,
        guest?.lastName,
        guest?.phoneNumber
      ];

      return values.some(value =>
        value?.toLowerCase().includes(search)
      );
    });
  }

  getGuestName(row: ReservationRow): string {
    if (!row.guest) {
      return 'Unknown guest';
    }

    return `${row.guest.lastName} ${row.guest.firstName}`;
  }

  getGuestPhone(row: ReservationRow): string {
    return row.guest?.phoneNumber || '—';
  }

  getRoom(row: ReservationRow): string {
    return row.room?.roomNumber || `Room #${row.reservation.roomId}`;
  }

  getCategory(row: ReservationRow): string {
    return row.category?.name || '—';
  }

  getRateName(row: ReservationRow): string {
    return row.rate?.name || `Rate #${row.reservation.rateId}`;
  }

  getRatePrice(row: ReservationRow): string {
    if (!row.rate) {
      return '—';
    }

    return `${row.rate.price} ${row.rate.currency}`;
  }

  getGuestCount(row: ReservationRow): string {
    const adults = row.reservation.adults;
    const children = row.reservation.children;

    return children > 0
      ? `${adults} + ${children}`
      : `${adults}`;
  }

  isActionLoading(id: number): boolean {
    return this.actionLoadingId === id;
  }

  canCheckIn(row: ReservationRow): boolean {
    return (
      row.reservation.status === 'RESERVED' ||
      row.reservation.status === 'CONFIRMED'
    );
  }

  canCheckOut(row: ReservationRow): boolean {
    return row.reservation.status === 'CHECKED_IN';
  }

  canCancel(row: ReservationRow): boolean {
    return (
      row.reservation.status === 'RESERVED' ||
      row.reservation.status === 'CONFIRMED'
    );
  }

  canNoShow(row: ReservationRow): boolean {
    return (
      row.reservation.status === 'RESERVED' ||
      row.reservation.status === 'CONFIRMED'
    );
  }

  checkIn(row: ReservationRow): void {
    this.runAction(
      row.reservation.id,
      () => this.reservationService.checkIn(row.reservation.id)
    );
  }

  checkOut(row: ReservationRow): void {
    this.runAction(
      row.reservation.id,
      () => this.reservationService.checkOut(row.reservation.id)
    );
  }

  cancel(row: ReservationRow): void {
    this.runAction(
      row.reservation.id,
      () => this.reservationService.cancel(row.reservation.id)
    );
  }

  noShow(row: ReservationRow): void {
    this.runAction(
      row.reservation.id,
      () => this.reservationService.noShow(row.reservation.id)
    );
  }

  private runAction(
    id: number,
    action: () => ReturnType<ReservationService['checkIn']>
  ): void {
    this.actionLoadingId = id;
    this.error = '';

    action().subscribe({
      next: () => {
        this.actionLoadingId = null;
        this.loadReservations();
      },
      error: error => {
        this.actionLoadingId = null;
        this.error =
          error?.error?.message ||
          error?.message ||
          `Reservation action failed. HTTP ${error?.status || ''}`;

        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
