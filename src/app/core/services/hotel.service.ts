import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel/hotel.model';
import { HotelRequest } from '../models/hotel/hotel-request.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/hotels';

  getAll(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  getById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(
      `${this.apiUrl}/${id}`
    );
  }

  create(request: HotelRequest): Observable<Hotel> {
    return this.http.post<Hotel>(
      this.apiUrl,
      request
    );
  }

  update(id: number, request: HotelRequest): Observable<Hotel> {
    return this.http.put<Hotel>(
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
