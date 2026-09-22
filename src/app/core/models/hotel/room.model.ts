import { RoomStatus } from './room-status.enum';
import { RoomView } from './room-view.enum';

export interface Room {
  id: number;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  roomView: RoomView;
  hotelId: number;
  categoryId: number;
}
