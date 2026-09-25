import { HotelGridReservation } from './hotel-grid-reservation.model';
import {RoomView} from '../hotel/room-view.enum';
import {RoomStatus} from '../hotel/room-status.enum';

export interface HotelGridRoom {
  id: number;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  roomView: RoomView;
  hotelId: number;
  categoryId: number;
  reservations: HotelGridReservation[];
}
