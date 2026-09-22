import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HotelGrid } from './hotel-grid';

describe('HotelGrid', () => {
  let component: HotelGrid;
  let fixture: ComponentFixture<HotelGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelGrid]
    }).compileComponents();

    fixture = TestBed.createComponent(HotelGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain hotel rooms', () => {
    expect(component.rooms.length).toBe(19);
  });

  it('should contain seven dates', () => {
    expect(component.dates.length).toBe(7);
  });

  it('should find reservation for occupied room and date', () => {
    const booking = component.getBooking(101, '2026-09-23');

    expect(booking).toBeTruthy();
    expect(booking?.guestName).toBe('John Smith');
  });

  it('should return null for available room and date', () => {
    const booking = component.getBooking(101, '2026-09-26');

    expect(booking).toBeNull();
  });

  it('should filter rooms by category', () => {
    component.selectCategory('Standard');

    expect(component.filteredRooms.length).toBe(5);
    expect(component.filteredRooms.every(room => room.category === 'Standard')).toBeTruthy();;
  });
});
