import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Claim } from '../models/Claim';
import { Observable } from 'rxjs';

/**
 * Service to handle operations related to claims.
 */
@Injectable({
  providedIn: 'root',
})
export class ClaimsService {
  // API endpoint to fetch all claims
  private apiUrl = 'http://localhost:8080/api/claims/getAllClaims';

  constructor(private http: HttpClient) {}

  // Fetch all claims from the backend
  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.apiUrl);
  }
}
