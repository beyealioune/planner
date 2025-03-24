import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityServiceService {

  private apiUrl = `http://localhost:8080/api/availabilities`; // Remplacez par votre URL backend

  constructor(private http: HttpClient) {}

  // Récupérer les disponibilités pour un utilisateur
  getUserAvailabilities(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Ajouter une disponibilité
  addAvailability(userId: number | null, date: string, isAvailable: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { userId, date, isAvailable });
  }

  // Supprimer une disponibilité
  deleteAvailability(availabilityId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${availabilityId}`);

  }

  updateAvailability(availabilityId: number, availability: any): Observable<void> {
    return this.http.put<void>(`/api/availabilities/${availabilityId}`, availability);
  }



  getCommonAvailabilities(user1Id: number, user2Id: number): Observable<any[]> {
    return this.http.get<any[]>(
      `/api/availabilities/common?user1=${user1Id}&user2=${user2Id}`
    );
  }
  
}
