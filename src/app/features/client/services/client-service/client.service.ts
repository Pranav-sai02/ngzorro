import { Injectable } from '@angular/core';
import { Client } from '../../models/Client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../../constants/api-endpoints';

/**
 * Service for managing client-related operations via API.
 */
@Injectable({
  providedIn: 'root',
})
export class ClientService {
  // API endpoint for clients
  private apiUrl = API_ENDPOINTS.CLIENT;

  constructor(private http: HttpClient) {}

  // Get the list of all clients
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  // Get a single client by ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  // Create a new client record
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  // Update an existing client by ID
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  // Permanently delete a client by ID
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Soft delete a client by setting IsDeleted to true
  softDelete(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { IsDeleted: true });
  }
}
