import { Injectable } from '@angular/core';
import { Client } from '../../models/Client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = API_ENDPOINTS.CLIENT;

  constructor(private http: HttpClient) { }

  getClient(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  updateClient(editedUser: Client) {
    throw new Error('Method not implemented.');
  }
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }
}
