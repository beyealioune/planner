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
  styleUrls: ['./planning.component.css'],
})
export class PlanningComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  daysOfMonth: (number | null)[] = [];
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  events: any[] = []; // Liste des disponibilités
  selectedDate: Date | null = null;
  userId: number | null = null;

  constructor(
    private userService: UserService,
    private availabilityService: AvailabilityServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.generateCalendar(this.currentMonth, this.currentYear);
    this.loadUser();
  }

  // === Méthodes liées au calendrier ===
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

  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  getFebDays(year: number): number {
    return this.isLeapYear(year) ? 29 : 28;
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

  // === Gestion des disponibilités ===
  setAvailability(isAvailable: boolean): void {
    if (!this.selectedDate) {
      console.error('Aucune date sélectionnée');
      return;
    }

    const date = this.selectedDate.toISOString().split('T')[0];
    const existingEvent = this.events.find((e) => e.date === date);

    if (existingEvent) {
      this.markAvailability(existingEvent.id, isAvailable);
    } else {
      this.addAvailability(date, isAvailable);
    }
  }

  addAvailability(date: string, isAvailable: boolean): void {
    if (!this.userId) {
      console.error('User ID non défini');
      return;
    }

    this.availabilityService.addAvailability(this.userId, date, isAvailable).subscribe(
      () => {
        console.log('Disponibilité ajoutée avec succès');
        this.loadUserAvailabilities();
      },
      (error) => console.error('Erreur lors de l\'ajout de disponibilité :', error)
    );
  }

  removeAvailability(eventId: number): void {
    this.availabilityService.deleteAvailability(eventId).subscribe(() => {
      this.loadUserAvailabilities();
    });
  }

  markAvailability(availabilityId: number, isAvailable: boolean): void {
    this.availabilityService.updateAvailability(availabilityId, { isAvailable }).subscribe(
      () => this.loadUserAvailabilities(),
      (error) => console.error('Erreur lors de la mise à jour de disponibilité :', error)
    );
  }

  selectDate(day: number): void {
    if (!day) return;

    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
    console.log('Date sélectionnée:', this.selectedDate);
  }

  // === Gestion de l'utilisateur et de ses données ===
  loadUser(): void {
    this.userService.getAuthenticatedUser().subscribe((user: any) => {
      this.userId = user.id;
      this.loadUserAvailabilities();
    });
  }

  loadUserAvailabilities(): void {
    if (!this.userId) return;
    this.availabilityService.getUserAvailabilities(this.userId).subscribe((availabilities: any) => {
      this.events = availabilities.map((a: any) => ({
        id: a.id,
        date: a.date,
        time: a.time,
        isAvailable: a.isAvailable,
      }));
    });
  }
}
