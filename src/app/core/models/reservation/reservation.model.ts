import { Rate } from '../billing/rate.model';
import { Room } from '../hotel/room.model';
import { Profile } from './profile.model';
import { ReservationComment } from './reservation-comment.model';
import { ReservationStatus } from './reservation-status.enum';

export interface Reservation {
  id: number;
  confirmationNumber: string;
  room: Room;
  rate: Rate;
  primaryGuest: Profile;
  guestIds: number[];
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  status: ReservationStatus;
  comments: ReservationComment[];
  createdAt: string;
  folioId: number;
}
