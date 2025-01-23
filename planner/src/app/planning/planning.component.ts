import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AvailabilityServiceService } from '../service/availability-service.service';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.css'
})
export class PlanningComponent implements OnInit{

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  daysOfMonth: (number | null)[] = [];
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  events: any[] = [];
  selectedDate: Date | null = null;
  userId: number | null = null;

  constructor(
    private userService: UserService,
    private availabilityService: AvailabilityServiceService, private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.generateCalendar(this.currentMonth, this.currentYear);
    this.loadUser();
  }
  selectMonth(index: number): void {
    this.currentMonth = index; // Met à jour le mois actuel
    this.generateCalendar(this.currentMonth, this.currentYear); // Regénère le calendrier
  }
  
  loadUser(): void {
    this.userService.getAuthenticatedUser().subscribe((user : any) => {
      this.userId = user.id;
      this.loadUserAvailabilities();
    });
  }

  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  getFebDays(year: number): number {
    return this.isLeapYear(year) ? 29 : 28;
  }
  selectDate(day: number): void {
    if (!day) return; // Si aucun jour sélectionné, ne rien faire
  
    const date = new Date(this.currentYear, this.currentMonth, day).toISOString().split('T')[0];
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
  
    const availability = this.events.find((e) => e.date === date);
  
    if (availability) {
      // Si la date est déjà disponible, inverser l'état (disponible -> non disponible)
      this.markAvailability(availability.id, !availability.isAvailable);
    } else {
      // Sinon, ajouter la disponibilité
      this.addAvailability(date);
    }
  }
  

  generateCalendar(month: number, year: number): void {
    const daysInMonth = [
      31, this.getFebDays(year), 31, 30, 31, 30,
      31, 31, 30, 31, 30, 31,
    ];
    const firstDay = new Date(year, month, 1).getDay();
    this.daysOfMonth = Array.from({ length: firstDay + daysInMonth[month] }, (_, i) =>
      i < firstDay ? null : i - firstDay + 1
    );
  }
  

  prevYear(): void {
    this.currentYear--;
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  nextYear(): void {
    this.currentYear++;
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.prevYear();
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.nextYear();
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  isDateSelected(day: number): boolean {
    return this.selectedDate?.getDate() === day;
  }

  isDateAvailable(day: number): boolean {
    if (!day) return false;
    const date = new Date(this.currentYear, this.currentMonth, day).toISOString().split('T')[0];
    return this.events.some((e) => e.date === date);
  }

  toggleAvailability(day: number): void {
    if (!day || !this.userId) return;
    const date = new Date(this.currentYear, this.currentMonth, day).toISOString().split('T')[0];
    const availability = this.events.find((e) => e.date === date);

    if (availability) {
      this.removeAvailability(availability.id);
    } else {
      this.addAvailability(date);
    }
  }

  loadUserAvailabilities(): void {
    if (!this.userId) return;
    this.availabilityService.getUserAvailabilities(this.userId).subscribe((availabilities : any) => {
      this.events = availabilities.map((a : any) => ({
        id: a.id,
        date: a.date,
        time: a.time,
      }));
    });
  }

  removeAvailability(eventId: number): void {
    this.availabilityService.deleteAvailability(eventId).subscribe(() => {
      this.loadUserAvailabilities();
    });
  }


  addAvailabilityForDate(day: number): void {
    if (!day || !this.userId) return;
    const date = new Date(this.currentYear, this.currentMonth, day).toISOString().split('T')[0];
    this.availabilityService.addAvailability(this.userId, date, '00:00').subscribe(() => {
      this.loadUserAvailabilities(); // Recharge les disponibilités
    });
  }
  
  markAsUnavailable(day: number): void {
    if (!day || !this.userId) return;
    const date = new Date(this.currentYear, this.currentMonth, day).toISOString().split('T')[0];
    const availability = this.events.find((e) => e.date === date);
  
    if (availability) {
      this.markAvailability(availability.id, false); // Met à jour la disponibilité
      this.loadUserAvailabilities();
    }
  }
  
  addAvailability(date: string): void {
    if (!this.userId) return;
    console.log(`Adding availability for user ${this.userId} on ${date}`);
    this.availabilityService.addAvailability(this.userId, date, '00:00').subscribe(
      () => this.loadUserAvailabilities(),
      (error) => console.error('Error adding availability:', error)
    );
  }
  
  markAvailability(availabilityId: number, isAvailable: boolean): void {
    console.log(`Updating availability ${availabilityId} to ${isAvailable}`);
    this.availabilityService.updateAvailability(availabilityId, { isAvailable }).subscribe(
      () => this.loadUserAvailabilities(),
      (error) => console.error('Error updating availability:', error)
    );
  }

  recupereMe(){
    this.authService.me().subscribe((user: any) => {
      console.log('Utilisateur récupéré après connexion:', user);
      
    });
  }
  
  
}