import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAuthenticatedUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}auth/me`);
  }

  updateUserProfile(user: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}users/auth/me`, user);
  }
}
