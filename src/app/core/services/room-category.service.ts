import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoomCategory {
  id: number;
  name: string;
  description: string;
  countOfBeds: number;
  hotelId: number;
}

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
}
