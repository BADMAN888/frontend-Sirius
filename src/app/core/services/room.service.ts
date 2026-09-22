import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoomResponse {
  id: number;
  roomNumber: number;
  floor: number;
  status: string;
  roomView: string;
  hotelId: number;
  categoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/rooms';

  getAll(): Observable<RoomResponse[]> {
    return this.http.get<RoomResponse[]>(this.apiUrl);
  }

  getByHotelId(hotelId: number): Observable<RoomResponse[]> {
    return this.http.get<RoomResponse[]>(
      `${this.apiUrl}/hotel/${hotelId}`
    );
  }

  getById(id: number): Observable<RoomResponse> {
    return this.http.get<RoomResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}
