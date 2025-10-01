import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimetableDayDialogComponent } from './timetable-day-dialog.component';

describe('TimetableDayDialogComponent', () => {
  let component: TimetableDayDialogComponent;
  let fixture: ComponentFixture<TimetableDayDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimetableDayDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableDayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
