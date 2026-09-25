import { HotelGridRoom } from './hotel-grid-room.model';

export interface HotelGrid {
  startDate: string;
  endDate: string;
  rooms: HotelGridRoom[];
}
