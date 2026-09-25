import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomCategory } from '../models/hotel/room-category.model';
import { RoomCategoryRequest } from '../models/hotel/room-category-request.model';

@Injectable({
  providedIn: 'root'
})
export class RoomCategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/room-category';

  getAll(): Observable<RoomCategory[]> {
    return this.http.get<RoomCategory[]>(this.apiUrl);
  }

  getById(id: number): Observable<RoomCategory> {
    return this.http.get<RoomCategory>(
      `${this.apiUrl}/${id}`
    );
  }

  getByHotelId(hotelId: number): Observable<RoomCategory[]> {
    return this.http.get<RoomCategory[]>(
      `${this.apiUrl}/by-hotel/${hotelId}`
    );
  }

  create(request: RoomCategoryRequest): Observable<RoomCategory> {
    return this.http.post<RoomCategory>(
      this.apiUrl,
      request
    );
  }

  update(
    id: number,
    request: RoomCategoryRequest
  ): Observable<RoomCategory> {
    return this.http.put<RoomCategory>(
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
