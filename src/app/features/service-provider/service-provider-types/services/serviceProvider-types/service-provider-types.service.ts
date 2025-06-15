import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceProviderTypes } from '../../models/ServiceProviderTypes';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../../../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderTypesService {
  // API endpoint for service provider types
  private readonly apiUrl = API_ENDPOINTS.SERVICE_PROVIDER_TYPES;

  constructor(private http: HttpClient) {}

  // Get all service provider types
  getAll(): Observable<ServiceProviderTypes[]> {
    return this.http.get<ServiceProviderTypes[]>(this.apiUrl);
  }

  // Get a service provider type by ID
  get(id: number): Observable<ServiceProviderTypes> {
    return this.http.get<ServiceProviderTypes>(`${this.apiUrl}/${id}`);
  }

  // Create a new service provider type
  create(payload: ServiceProviderTypes): Observable<ServiceProviderTypes> {
    return this.http.post<ServiceProviderTypes>(this.apiUrl, payload);
  }

  // Update an existing service provider type
  update(id: number, payload: ServiceProviderTypes): Observable<ServiceProviderTypes> {
    return this.http.put<ServiceProviderTypes>(`${this.apiUrl}/${id}`, payload);
  }

  // Hard delete a service provider type
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Soft delete a service provider type by marking it as deleted
  softDeleteServiceProviderType(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, { IsDeleted: true });
  }
}
