import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityServiceService {

  private apiUrl = `http://localhost:8080/api/availabilities`;

  constructor(private http: HttpClient) {}

  // Obtenir toutes les dispos d'un utilisateur
  getUserAvailabilities(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

// 🔁 Corrige ici aussi en camelCase
addAvailability(userId: number, date: string, isAvailable: boolean): Observable<any> {
  return this.http.post(`${this.apiUrl}`, {
    userId: userId,
    date: date,
    isAvailable: isAvailable 
  });
}


updateAvailability(id: number, data: { isAvailable: boolean }): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, data);
}


  // Supprimer une disponibilité
  deleteAvailability(availabilityId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${availabilityId}`);
  }

  // Obtenir les disponibilités communes
  getCommonAvailabilities(user1Id: number, user2Id: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/common?user1=${user1Id}&user2=${user2Id}`
    );
  }
  
}
