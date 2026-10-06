import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Reservation } from '../../../core/models/reservation/reservation.model';
import { ReservationRequest } from '../../../core/models/reservation/reservation-request.model';
import { Profile } from '../../../core/models/reservation/profile.model';
import { Room } from '../../../core/models/hotel/room.model';
import { Rate } from '../../../core/models/billing/rate.model';
import { ReservationService } from '../../../core/services/reservation.service';
import { ProfileService } from '../../../core/services/profile.service';
import { RoomService } from '../../../core/services/room.service';
import { RateService } from '../../../core/services/rate.service';

@Component({
  selector: 'app-reservation-details',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './reservation-details.html',
  styleUrl: './reservation-details.scss'
})
export class ReservationDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly reservationService = inject(ReservationService);
  private readonly profileService = inject(ProfileService);
  private readonly roomService = inject(RoomService);
  private readonly rateService = inject(RateService);

  readonly reservation = signal<Reservation | null>(null);

  readonly profiles = signal<Profile[]>([]);
  readonly rooms = signal<Room[]>([]);
  readonly rates = signal<Rate[]>([]);

  readonly editMode = signal(false);

  readonly editRoomId = signal(0);
  readonly editRateId = signal(0);
  readonly editPrimaryGuestId = signal(0);
  readonly editCheckIn = signal('');
  readonly editCheckOut = signal('');
  readonly editAdults = signal(1);
  readonly editChildren = signal(0);

  readonly loading = signal(true);
  readonly loadingEditData = signal(false);
  readonly saving = signal(false);
  readonly saved = signal(false);

  readonly error = signal('');
  readonly saveError = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('Invalid reservation ID.');
      this.loading.set(false);
      return;
    }

    this.loadReservation(id);
  }

  private loadReservation(id: number): void {
    this.loading.set(true);
    this.error.set('');
    this.saveError.set('');
    this.saved.set(false);

    this.reservationService.getById(id).subscribe({
      next: reservation => {
        this.reservation.set(reservation);
        this.initializeForm(reservation);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(
          error?.error?.message ||
          error?.message ||
          `Failed to load reservation. HTTP ${error?.status || ''}`
        );
        this.loading.set(false);
      }
    });
  }

  startEdit(): void {
    const reservation = this.reservation();

    if (!reservation || !this.canEdit() || this.loadingEditData()) {
      return;
    }

    this.saveError.set('');
    this.saved.set(false);

    this.initializeForm(reservation);
    this.loadEditData();
  }

  private loadEditData(): void {
    this.loadingEditData.set(true);

    forkJoin({
      profiles: this.profileService.getAll(),
      rooms: this.roomService.getAll(),
      rates: this.rateService.getAll()
    }).subscribe({
      next: data => {
        this.profiles.set(data.profiles);
        this.rooms.set(data.rooms);
        this.rates.set(data.rates);

        this.editMode.set(true);
        this.loadingEditData.set(false);
      },
      error: error => {
        this.loadingEditData.set(false);
        this.saveError.set(
          error?.error?.message ||
          error?.message ||
          `Failed to load edit data. HTTP ${error?.status || ''}`
        );
      }
    });
  }

  cancelEdit(): void {
    const reservation = this.reservation();

    if (reservation) {
      this.initializeForm(reservation);
    }

    this.editMode.set(false);
    this.saveError.set('');
    this.saved.set(false);
  }

  save(): void {
    const reservation = this.reservation();

    if (!reservation || !this.canEdit() || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.saved.set(false);
    this.saveError.set('');

    const guestIds = Array.from(
      new Set([
        ...reservation.guestIds,
        this.editPrimaryGuestId()
      ])
    );

    const request: ReservationRequest = {
      roomId: this.editRoomId(),
      rateId: this.editRateId(),
      primaryGuestId: this.editPrimaryGuestId(),
      guestIds,
      checkIn: this.toLocalDateTime(this.editCheckIn()),
      checkOut: this.toLocalDateTime(this.editCheckOut()),
      adults: this.editAdults(),
      children: this.editChildren()
    };

    this.reservationService.update(reservation.id, request).subscribe({
      next: updatedReservation => {
        this.reservation.set(updatedReservation);
        this.initializeForm(updatedReservation);

        this.saving.set(false);
        this.saved.set(true);
        this.editMode.set(false);
      },
      error: error => {
        this.saving.set(false);
        this.saveError.set(
          error?.error?.message ||
          error?.message ||
          `Failed to save reservation. HTTP ${error?.status || ''}`
        );
      }
    });
  }

  private initializeForm(reservation: Reservation): void {
    this.editRoomId.set(reservation.room.id);
    this.editRateId.set(reservation.rate.id);
    this.editPrimaryGuestId.set(reservation.primaryGuest.id);
    this.editCheckIn.set(this.toDateTimeLocal(reservation.checkIn));
    this.editCheckOut.set(this.toDateTimeLocal(reservation.checkOut));
    this.editAdults.set(reservation.adults);
    this.editChildren.set(reservation.children);
  }

  canEdit(): boolean {
    const status = this.reservation()?.status;

    return status === 'RESERVED' || status === 'CONFIRMED';
  }

  goBack(): void {
    this.router.navigate(['/reservations/check-in']);
  }

  getGuestName(): string {
    const guest = this.reservation()?.primaryGuest;

    if (!guest) {
      return '—';
    }

    return [
      guest.lastName,
      guest.firstName,
      guest.middleName
    ]
      .filter(Boolean)
      .join(' ');
  }

  getGuestDocument(): string {
    const document = this.reservation()?.primaryGuest?.guestDocument;

    if (!document) {
      return '—';
    }

    return Object.values(document)
      .filter(
        value =>
          value !== null &&
          value !== undefined &&
          value !== ''
      )
      .join(' ');
  }

  getComments(): string {
    const comments = this.reservation()?.comments;

    if (!comments?.length) {
      return 'No comments';
    }

    return comments
      .map(comment => comment.text)
      .join(', ');
  }

  getRoomName(): string {
    return this.reservation()?.room?.roomNumber || '—';
  }

  getRateName(): string {
    return this.reservation()?.rate?.name || '—';
  }

  getRatePrice(): string {
    const rate = this.reservation()?.rate;

    if (!rate) {
      return '—';
    }

    return `${rate.price} ${rate.currency}`;
  }

  getCategoryId(): number | null {
    return this.reservation()?.room?.categoryId ?? null;
  }

  private toDateTimeLocal(value: string): string {
    return value ? value.slice(0, 16) : '';
  }

  private toLocalDateTime(value: string): string {
    return value.length === 16
      ? `${value}:00`
      : value;
  }
  getProfileName(profile: Profile): string {
    return [
      profile.lastName,
      profile.firstName,
      profile.middleName
    ]
      .filter(Boolean)
      .join(' ');
  }
}
