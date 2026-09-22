import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservationGuest {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber?: string;
  email?: string;
}

export interface ReservationResponse {
  id: number;
  confirmationNumber: string;
  roomId: number;
  guests: ReservationGuest[];
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  status: string;
  comments?: string[];
  createdAt: string;
  folioId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/reservations';

  getAll(): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<ReservationResponse> {
    return this.http.get<ReservationResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  getByDateRange(
    startDate: string,
    endDate: string
  ): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(
      `${this.apiUrl}/by-date-range`,
      {
        params: {
          startDate,
          endDate
        }
      }
    );
  }
}
