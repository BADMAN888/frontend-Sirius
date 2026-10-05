import { ReservationComment } from './reservation-comment.model';
import { ReservationStatus } from './reservation-status.enum';

export interface ReservationCheckOut {
  id: number;
  confirmationNumber: string;
  roomId: number;
  guestFirstName: string | null;
  guestLastName: string | null;
  guestMiddleName: string | null;
  checkIn: string;
  checkOut: string;
  status: ReservationStatus;
  comments: ReservationComment[];
  totalAmount: number;
}
