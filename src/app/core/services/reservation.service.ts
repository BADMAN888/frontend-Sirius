import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation/reservation.model';
import { ReservationRequest } from '../models/reservation/reservation-request.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/reservations';

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(
      `${this.apiUrl}/${id}`
    );
  }

  getByDateRange(
    startDate: string,
    endDate: string
  ): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.apiUrl}/by-date-range`,
      {
        params: {
          startDate,
          endDate
        }
      }
    );
  }

  create(request: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(
      this.apiUrl,
      request
    );
  }

  update(
    id: number,
    request: ReservationRequest
  ): Observable<Reservation> {
    return this.http.put<Reservation>(
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
