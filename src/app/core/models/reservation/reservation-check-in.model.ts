import { ReservationComment } from './reservation-comment.model';
import { ReservationStatus } from './reservation-status.enum';

export interface ReservationCheckIn {
  id: number;
  confirmationNumber: string;
  roomId: number;
  checkIn: string;
  checkOut: string;
  status: ReservationStatus;
  comments: ReservationComment[];
  folio: {
    totalAmount: number;
  };
}
