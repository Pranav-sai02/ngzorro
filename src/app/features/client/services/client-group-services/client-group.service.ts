import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientGroup } from '../../models/ClientGroup';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../constants/api-endpoints';

/**
 * Service to manage CRUD operations for client groups.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientGroupService {
  // API endpoint for client groups
  private apiUrl = API_ENDPOINTS.CLIENTGROUP;

  constructor(private http: HttpClient) {}

  // Fetch all client groups
  getClientGroups(): Observable<ClientGroup[]> {
    return this.http.get<ClientGroup[]>(this.apiUrl);
  }

  // Add a new client group
  addClientGroup(clientGroup: ClientGroup): Observable<ClientGroup> {
    return this.http.post<ClientGroup>(this.apiUrl, clientGroup);
  }

  // Update an existing client group
  updateClientGroup(clientGroup: ClientGroup): Observable<ClientGroup> {
    return this.http.put<ClientGroup>(`${this.apiUrl}/${clientGroup.ClientGroupId}`, clientGroup);
  }

  // Permanently delete a client group by ID
  deleteClientGroup(id: number): Observable<ClientGroup> {
    return this.http.delete<ClientGroup>(`${this.apiUrl}/${id}`);
  }

  // Soft delete a client group (mark as deleted without removing)
  softDeleteClientGroup(id: number): Observable<ClientGroup> {
    return this.http.patch<ClientGroup>(`${this.apiUrl}/${id}`, { IsDeleted: true });
  }
}
