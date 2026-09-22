import { ReservationStatus } from './reservation-status.enum';
import { ReservationComment } from './reservation-comment.model';

export interface Reservation {
  id: number;
  confirmationNumber: string;
  roomId: number;
  rateId: number;
  primaryGuestId: number;
  guestIds: number[];
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  status: ReservationStatus;
  comments: ReservationComment[];
  createdAt: string;
  folioId: number;
}
