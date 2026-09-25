import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HotelGrid } from './hotel-grid';
import { HotelService } from '../../core/services/hotel.service';
import { RoomCategoryService } from '../../core/services/room-category.service';
import { RoomService } from '../../core/services/room.service';
import { ReservationService } from '../../core/services/reservation.service';
import { of } from 'rxjs';

describe('HotelGrid', () => {
  let component: HotelGrid;
  let fixture: ComponentFixture<HotelGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelGrid],
      providers: [
        {
          provide: HotelService,
          useValue: {
            getById: () => of({
              id: 1,
              hotelName: 'Olga Grand Hotel',
              address: '',
              email: '',
              phone: '',
              checkInTime: '14:00:00',
              checkOutTime: '12:00:00'
            })
          }
        },
        {
          provide: RoomCategoryService,
          useValue: {
            getByHotelId: () => of([])
          }
        },
        {
          provide: RoomService,
          useValue: {
            getByHotelId: () => of([])
          }
        },
        {
          provide: ReservationService,
          useValue: {
            getAll: () => of([])
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HotelGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize seven dates', () => {
    expect(component.dates.length).toBe(7);
  });

  it('should load hotel data', () => {
    expect(component.hotel?.hotelName).toBe('Olga Grand Hotel');
  });

  it('should return all rooms when category is not selected', () => {
    component.rooms = [
      {
        id: 1,
        roomNumber: '101',
        floor: 1,
        status: 'AVAILABLE' as never,
        roomView: 'CITY' as never,
        hotelId: 1,
        categoryId: 1
      }
    ];

    component.selectCategory(null);

    expect(component.filteredRooms.length).toBe(1);
  });
});
