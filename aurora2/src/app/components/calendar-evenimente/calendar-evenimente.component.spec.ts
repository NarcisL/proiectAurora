import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEvenimenteComponent } from './calendar-evenimente.component';

describe('CalendarEvenimenteComponent', () => {
  let component: CalendarEvenimenteComponent;
  let fixture: ComponentFixture<CalendarEvenimenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarEvenimenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarEvenimenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
