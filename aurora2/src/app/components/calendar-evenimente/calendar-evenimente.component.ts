import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TypeEvent {
  id: number;
  title: string;
  description: string;
  startdate: Date;
  enddate: Date;
  icon: string;
}

@Component({
  selector: 'app-calendar-evenimente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-evenimente.component.html',
  styleUrl: './calendar-evenimente.component.css'
})
export class CalendarEvenimenteComponent {

  TypeEvents: TypeEvent[] = [
    {
      id: 1,
      title: 'FRONTEND DEVELOPMENT',
      description: 'Frontend development is the practice of converting data to a graphical interface for user interaction using HTML, CSS, and JavaScript.',
      startdate: new Date(2025, 3, 28),
      enddate: new Date(2026, 3, 30),
      icon: 'assets/damageboostevent.png'
    },
    {
      id: 2,
      title: 'BACKEND DEVELOPMENT',
      description: 'Backend development is the practice of building the server-side of a web application. It involves creating APIs, managing databases, and ensuring that the frontend and backend communicate effectively.',
      startdate: new Date(2025, 3, 29),
      enddate: new Date(2026, 3, 30),
      icon:'assets/dropevent.png'
    },
    {
      id: 3,
      title: 'GAME DEVELOPMENT',
      description: 'Game development is the process of creating video games. It involves designing, programming, and testing games for various platforms.',
      startdate: new Date(2025, 4, 30),
      enddate: new Date(2026, 3, 30),
      icon:'assets/worldbossevent.png'
    }
  ];

  getCurrentEvents(): TypeEvent[] {
    const currentDate = new Date();
    return this.TypeEvents.filter(event => event.startdate <= currentDate && event.enddate >= currentDate);
  }

  getUpcomingEvents(): TypeEvent[] {
    const currentDate = new Date();
    return this.TypeEvents.filter(event => event.startdate > currentDate);
  }

  calculateRemainingDuration(event: TypeEvent): string {
    const currentDate = new Date();
    const duration = event.enddate.getTime() - currentDate.getTime();
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${days} days, ${hours} hours, ${minutes} minutes`;
  }
  calculateRemainingTimeUntil(event: TypeEvent): string {
    const currentDate = new Date();
    const timeuntil =event.startdate.getTime() - currentDate.getTime();
    const days = Math.floor(timeuntil / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeuntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeuntil % (1000 * 60 * 60)) / (1000 * 60));
    return `${days} days, ${hours} hours, ${minutes} minutes`;
  }

}