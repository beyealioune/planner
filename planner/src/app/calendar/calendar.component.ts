import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  days: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  weeks: any[] = [];
  monthName: string = '';
  year: number = new Date().getFullYear();
  events: any[] = [
    { name: 'Town hall meeting', date: 'Oct 5', time: '16:00' },
    { name: 'Meet with George', date: 'Oct 7', time: '10:00' },
    { name: 'Vacation!!!', date: 'Oct 16 - Oct 18', time: 'All day' },
  ];

  currentMonth: number = new Date().getMonth();
  currentDate: Date = new Date();

  ngOnInit(): void {
    this.updateCalendar();
  }

  selectedDate: any = null;

selectDate(date: any): void {
  if (date.isCurrentMonth && date.day !== '') {
    this.selectedDate = date;
    this.updateCalendar(); // Pour rafraîchir l'affichage
  }
}

updateCalendar(): void {
  const firstDay = new Date(this.year, this.currentMonth, 1);
  const lastDay = new Date(this.year, this.currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();

  this.monthName = firstDay.toLocaleString('default', { month: 'long' });
  this.weeks = [];
  let dayCounter = 1;

  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startDay || dayCounter > daysInMonth) {
        week.push({ day: '', isCurrentMonth: false, isToday: false, hasEvent: false });
      } else {
        const isToday = this.currentDate.getDate() === dayCounter && this.currentMonth === this.currentDate.getMonth();
        const isSelected = this.selectedDate?.day === dayCounter && this.selectedDate?.isCurrentMonth;
        week.push({
          day: dayCounter,
          isCurrentMonth: true,
          isToday,
          hasEvent: this.hasEvent(dayCounter),
          isSelected
        });
        dayCounter++;
      }
    }
    this.weeks.push(week);
  }
}



  hasEvent(day: number): boolean {
    return this.events.some(event => event.date.includes(day.toString()));
  }

  prevMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.year--;
    }
    this.updateCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.year++;
    }
    this.updateCalendar();
  }
}
