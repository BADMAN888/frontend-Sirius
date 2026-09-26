import { ReservationStatus } from '../reservation/reservation-status.enum';

export interface HotelGridReservation {
  id: number;
  confirmationNumber: string;
  checkIn: string;
  checkOut: string;
  status: ReservationStatus;
  guestFirstName: string;
  guestLastName: string;
  guestPhone: string;
}
