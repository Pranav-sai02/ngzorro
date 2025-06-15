import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/User';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = API_ENDPOINTS.USERS; // Base API URL for user-related requests

  constructor(private http: HttpClient) {}

  // Fetch all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Update an existing user
  updateUser(user: User): Observable<User> {
    console.log('[UserService] Updating user:', user.UserEmail, 'IsDeleted:', user.IsDeleted);
    return this.http.put<User>(`${this.apiUrl}/${user.Id}`, user);
  }

  // Create a new user
  createUser(user: User): Observable<User> {
    console.log('[UserService] Creating user:', user);
    return this.http.post<User>(this.apiUrl, user);
  }
}
