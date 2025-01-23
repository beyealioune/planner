import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityServiceService {

  private apiUrl = ''; // Remplacez par votre URL backend

  constructor(private http: HttpClient) {}

  // Récupérer les disponibilités pour un utilisateur
  getUserAvailabilities(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Ajouter une disponibilité
  addAvailability(userId: number, date: string, time: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { userId, date, time });
  }

  // Supprimer une disponibilité
  deleteAvailability(availabilityId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${availabilityId}`);

  }

  updateAvailability(availabilityId: number, availability: any): Observable<void> {
    return this.http.put<void>(`/api/availabilities/${availabilityId}`, availability);
  }
  
}
