import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceProviders } from '../../models/ServiceProviders';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicProvidersService {
  // API endpoint for service providers
  private apiUrl = 'http://fusionedge.runasp.net/ServiceProvider';

  constructor(private http: HttpClient) { }

  // Get all service providers
  getServiceProviders(): Observable<ServiceProviders[]> {
    return this.http.get<ServiceProviders[]>(this.apiUrl);
  }

  // Add a new service provider
  addServiceProvider(provider: ServiceProviders): Observable<ServiceProviders> {
    return this.http.post<ServiceProviders>(this.apiUrl, provider);
  }

  // Update a service provider by ID
  updateServiceProvider(provider: ServiceProviders): Observable<ServiceProviders> {
    const url = `${this.apiUrl}/${provider.ServiceProviderId}`;
    return this.http.put<ServiceProviders>(url, provider);
  }

  // Hard delete a service provider
  deleteServiceProvider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Soft delete a service provider by marking it as deleted
  softDeleteServiceProvider(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { IsDeleted: true });
  }
}
