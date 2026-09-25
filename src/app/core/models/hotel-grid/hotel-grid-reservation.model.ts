import {ReservationStatus} from '../reservation/reservation-status.enum';


export interface HotelGridReservation {
  id: number;
  confirmationNumber: string;
  checkInDate: string;
  checkOutDate: string;
  status: ReservationStatus;
}
