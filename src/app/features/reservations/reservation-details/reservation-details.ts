import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Reservation } from '../../../core/models/reservation/reservation.model';
import { Profile } from '../../../core/models/reservation/profile.model';
import { Room } from '../../../core/models/hotel/room.model';
import { Rate } from '../../../core/models/billing/rate.model';
import {
  RoomCategory,
  RoomCategoryService
} from '../../../core/services/room-category.service';
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
  private readonly roomCategoryService = inject(RoomCategoryService);

  readonly reservation = signal<Reservation | null>(null);
  readonly guest = signal<Profile | null>(null);
  readonly room = signal<Room | null>(null);
  readonly rate = signal<Rate | null>(null);
  readonly category = signal<RoomCategory | null>(null);

  readonly loading = signal(true);
  readonly error = signal('');

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

    this.reservationService
      .getById(id)
      .subscribe({
        next: reservation => {
          this.reservation.set(reservation);

          forkJoin({
            guest: this.profileService.getById(
              reservation.primaryGuestId
            ),
            room: this.roomService.getById(
              reservation.roomId
            ),
            rate: this.rateService.getById(
              reservation.rateId
            )
          }).subscribe({
            next: data => {
              this.guest.set(data.guest);
              this.room.set(data.room);
              this.rate.set(data.rate);

              this.roomCategoryService
                .getById(data.room.categoryId)
                .subscribe({
                  next: category => {
                    this.category.set(category);
                    this.loading.set(false);
                  },
                  error: error => {
                    this.error.set(
                      error?.error?.message ||
                      error?.message ||
                      `Failed to load room category. HTTP ${error?.status || ''}`
                    );
                    this.loading.set(false);
                  }
                });
            },
            error: error => {
              this.error.set(
                error?.error?.message ||
                error?.message ||
                `Failed to load reservation details. HTTP ${error?.status || ''}`
              );
              this.loading.set(false);
            }
          });
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

  goBack(): void {
    this.router.navigate(['/reservations/check-in']);
  }

  getGuestName(): string {
    const guest = this.guest();

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
    const document = this.guest()?.guestDocument;

    if (!document) {
      return '—';
    }

    return Object.values(document)
      .filter(value => value !== null && value !== undefined && value !== '')
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
}
