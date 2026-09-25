import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rate } from '../models/billing/rate.model';
import { RateRequest } from '../models/billing/rate-request.model';

@Injectable({
  providedIn: 'root'
})
export class RateService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/rates';

  getAll(): Observable<Rate[]> {
    return this.http.get<Rate[]>(this.apiUrl);
  }

  getById(id: number): Observable<Rate> {
    return this.http.get<Rate>(
      `${this.apiUrl}/${id}`
    );
  }

  create(request: RateRequest): Observable<Rate> {
    return this.http.post<Rate>(
      this.apiUrl,
      request
    );
  }

  update(id: number, request: RateRequest): Observable<Rate> {
    return this.http.put<Rate>(
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
