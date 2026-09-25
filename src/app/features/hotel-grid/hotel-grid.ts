import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

interface HotelRoom {
  roomNumber: string;
  floor: number;
  category: string;
}

interface HotelDay {
  date: Date;
  day: number;
  weekday: string;
  isToday: boolean;
  isWeekend: boolean;
}

@Component({
  selector: 'app-hotel-grid',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './hotel-grid.html',
  styleUrl: './hotel-grid.scss'
})
export class HotelGrid {
  readonly days: HotelDay[] = this.createDays();

  readonly rooms: HotelRoom[] = [
    { roomNumber: '101', floor: 1, category: 'Standard' },
    { roomNumber: '102', floor: 1, category: 'Standard' },
    { roomNumber: '103', floor: 1, category: 'Standard' },
    { roomNumber: '104', floor: 1, category: 'Standard' },
    { roomNumber: '105', floor: 1, category: 'Standard' },

    { roomNumber: '201', floor: 2, category: 'Superior' },
    { roomNumber: '202', floor: 2, category: 'Superior' },
    { roomNumber: '203', floor: 2, category: 'Superior' },
    { roomNumber: '204', floor: 2, category: 'Superior' },
    { roomNumber: '205', floor: 2, category: 'Superior' },

    { roomNumber: '301', floor: 3, category: 'Junior Suite' },
    { roomNumber: '302', floor: 3, category: 'Junior Suite' },
    { roomNumber: '303', floor: 3, category: 'Junior Suite' },
    { roomNumber: '304', floor: 3, category: 'Suite' },
    { roomNumber: '305', floor: 3, category: 'Suite' },

    { roomNumber: '401', floor: 4, category: 'Suite' },
    { roomNumber: '402', floor: 4, category: 'Suite' },
    { roomNumber: '403', floor: 4, category: 'Suite' },
    { roomNumber: '404', floor: 4, category: 'Kozyn Corner' }
  ];

  private createDays(): HotelDay[] {
    const result: HotelDay[] = [];
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 31; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayOfWeek = date.getDay();

      result.push({
        date,
        day: date.getDate(),
        weekday: date.toLocaleDateString('en-US', {
          weekday: 'short'
        }),
        isToday: i === 0,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6
      });
    }

    return result;
  }
}
