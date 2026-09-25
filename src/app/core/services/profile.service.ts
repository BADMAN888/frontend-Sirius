import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/reservation/profile.model';
import { ProfileRequest } from '../models/reservation/profile-request.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/profiles';

  getAll(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl);
  }

  getById(id: number): Observable<Profile> {
    return this.http.get<Profile>(
      `${this.apiUrl}/${id}`
    );
  }

  create(request: ProfileRequest): Observable<Profile> {
    return this.http.post<Profile>(
      this.apiUrl,
      request
    );
  }

  update(id: number, request: ProfileRequest): Observable<Profile> {
    return this.http.put<Profile>(
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
