import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
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

    return this.http
      .get<HotelGrid>(
        this.apiUrl,
        {
          params,
          observe: 'response'
        }
      )
      .pipe(
        map(
          (
            response: HttpResponse<HotelGrid>
          ) => {
            console.log(
              'HOTEL GRID STATUS:',
              response.status
            );

            console.log(
              'HOTEL GRID BODY:',
              response.body
            );

            if (!response.body) {
              throw new Error(
                'Hotel grid response body is empty'
              );
            }

            return response.body;
          }
        )
      );
  }
}
