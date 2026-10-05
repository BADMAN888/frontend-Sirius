import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation/reservation.model';
import { ReservationRequest } from '../models/reservation/reservation-request.model';
import { ReservationCheckIn } from '../models/reservation/reservation-check-in.model';
import { ReservationCheckOut } from '../models/reservation/reservation-check-out.model';

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
      `${this.apiUrl}/date-range`,
      {
        params: {
          startDate,
          endDate
        }
      }
    );
  }

  getCheckIns(date: string): Observable<ReservationCheckIn[]> {
    return this.http.get<ReservationCheckIn[]>(
      `${this.apiUrl}/check-in`,
      {
        params: {
          date
        }
      }
    );
  }

  getCheckOuts(date: string): Observable<ReservationCheckOut[]> {
    return this.http.get<ReservationCheckOut[]>(
      `${this.apiUrl}/check-out`,
      {
        params: {
          date
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

  cancel(id: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/cancel`,
      {}
    );
  }

  checkIn(id: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/check-in`,
      {}
    );
  }

  checkOut(id: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/check-out`,
      {}
    );
  }

  noShow(id: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/no-show`,
      {}
    );
  }
}
