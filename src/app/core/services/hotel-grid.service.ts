import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelGrid } from '../models/hotel-grid/hotel-grid.model';

@Injectable({
  providedIn: 'root'
})
export class HotelGridService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/hotel-grid';

  getGrid(
    startDate: string,
    endDate: string
  ): Observable<HotelGrid> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<HotelGrid>(
      this.apiUrl,
      { params }
    );
  }
}
