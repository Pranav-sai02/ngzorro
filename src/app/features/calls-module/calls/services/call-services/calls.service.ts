import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Call } from '../../models/Cases';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../../constants/api-endpoints';

/**
 * Service to handle operations related to funeral call records.
 */
@Injectable({
  providedIn: 'root'
})
export class CallsService {

  // API endpoint for funeral records
  private apiUrl = API_ENDPOINTS.CALLS; // Replace with actual backend endpoint

  constructor(private http: HttpClient) {}

  // Fetch all funeral call records from the backend
  getUsers(): Observable<Call[]> {
    return this.http.get<Call[]>(this.apiUrl);
  }

  // Create a new funeral call record
  createUser(call: Call): Observable<Call> {
    console.log('Sending call:', call); // Debug log before sending
    return this.http.post<Call>(this.apiUrl, call);
  }
}
