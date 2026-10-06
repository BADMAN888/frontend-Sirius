export interface ReservationRequest {
  roomId: number;
  rateId: number;
  primaryGuestId: number;
  guestIds: number[];
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}
