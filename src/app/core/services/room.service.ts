import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/hotel/room.model';
import { RoomRequest } from '../models/hotel/room-request.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/rooms';

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  getByHotelId(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(
      `${this.apiUrl}/hotel/${hotelId}`
    );
  }

  getById(id: number): Observable<Room> {
    return this.http.get<Room>(
      `${this.apiUrl}/${id}`
    );
  }

  create(request: RoomRequest): Observable<Room> {
    return this.http.post<Room>(
      this.apiUrl,
      request
    );
  }

  update(id: number, request: RoomRequest): Observable<Room> {
    return this.http.put<Room>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
