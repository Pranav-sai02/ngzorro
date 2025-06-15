import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicesPage } from '../../models/Services-page';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ServicesPageService {
  // API endpoint for services page
  private readonly apiUrl = API_ENDPOINTS.SERVICES_PAGE;

  constructor(private http: HttpClient) {}

  // Get all services
  getAll(): Observable<ServicesPage[]> {
    return this.http.get<ServicesPage[]>(this.apiUrl);
  }

  // Get a service by ID
  get(id: number): Observable<ServicesPage> {
    return this.http.get<ServicesPage>(`${this.apiUrl}/${id}`);
  }

  // Create a new service entry
  create(payload: ServicesPage): Observable<ServicesPage> {
    return this.http.post<ServicesPage>(this.apiUrl, payload);
  }

  // Update an existing service entry
  update(serviceId: number, payload: ServicesPage): Observable<ServicesPage> {
    return this.http.put<ServicesPage>(`${this.apiUrl}/${serviceId}`, payload);
  }

  // Hard delete a service entry
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Soft delete a service entry by setting IsDeleted to true
  softDelete(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { IsDeleted: true });
  }
}
