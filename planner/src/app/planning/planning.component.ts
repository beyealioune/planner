// planning.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AvailabilityServiceService } from '../service/availability-service.service';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule
  ],
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
  events: any[] = [];
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

  isAvailable(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    date.setHours(12, 0, 0, 0);
    const formattedDate = date.toISOString().split('T')[0];
    const event = this.events.find(e => e.date === formattedDate);
    return event?.isAvailable === true;
  }

  isUnavailable(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    date.setHours(12, 0, 0, 0);
    const formattedDate = date.toISOString().split('T')[0];
    const event = this.events.find(e => e.date === formattedDate);
    return event?.isAvailable === false;
  }

  setAvailability(isAvailable: boolean): void {
    if (!this.selectedDate) return;

    const dateAtNoon = new Date(this.selectedDate);
    dateAtNoon.setHours(12, 0, 0, 0);
    const date = dateAtNoon.toISOString().split('T')[0];

    const existingEvent = this.events.find(e => e.date === date);

    if (existingEvent) {
      this.availabilityService.updateAvailability(existingEvent.id, {
        isAvailable: isAvailable
      }).subscribe(() => {
        this.events = this.events.map(event =>
          event.id === existingEvent.id ? { ...event, isAvailable } : event
        );
      });
    } else {
      this.availabilityService.addAvailability(this.userId!, date, isAvailable).subscribe((newEvent: any) => {
        this.events.push(newEvent);
      });
    }
  }

  removeAvailability(eventId: number): void {
    this.availabilityService.deleteAvailability(eventId).subscribe(() => {
      this.loadUserAvailabilities();
    });
  }

  selectDate(day: number): void {
    if (!day) return;
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
  }

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
        isAvailable: a.isAvailable
      }));
    });
  }
}