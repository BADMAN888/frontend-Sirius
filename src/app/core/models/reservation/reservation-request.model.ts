export interface ReservationRequest {
  roomId: number;
  rateId: number;
  primaryGuestId: number;
  guestIds: number[];
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
}
