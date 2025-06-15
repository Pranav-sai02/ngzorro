import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreaCodes } from '../../models/AreaCodes';
import { API_ENDPOINTS } from '../../../../constants/api-endpoints';

/**
 * Handles all HTTP operations related to Area Codes.
 */
@Injectable({
  providedIn: 'root',
})
export class AreaCodesService {
  private apiUrl = API_ENDPOINTS.AREA_CODES;

  constructor(private http: HttpClient) {}

  // Fetch all area codes from the backend
  getAreaCodes(): Observable<AreaCodes[]> {
    return this.http.get<AreaCodes[]>(this.apiUrl);
  }

  // Permanently delete an area code using its code
  deleteAreaCode(code: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${code}`);
  }

  // Add a new area code to the system
  addAreaCode(areaCode: AreaCodes): Observable<AreaCodes> {
    const payload = {
      AreaCode: areaCode.AreaCode,
      Description: areaCode.Description,
      Type: areaCode.Type,
      IsActive: areaCode.IsActive,
    };
    return this.http.post<AreaCodes>(this.apiUrl, payload);
  }

  // Update an existing area code using its ID and partial data
  updateAreaCode(areaCodeId: number, data: Partial<AreaCodes>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${areaCodeId}`, data);
  }

  // Soft delete: update the area code's IsActive or IsDeleted field instead of deleting permanently
  softDeleteAreaCode(areaCode: AreaCodes): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${areaCode.AreaCode}`, areaCode);
  }
}
