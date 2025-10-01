import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimetableHourDialogComponent } from './timetable-hour-dialog.component';

describe('TimetableHourDialogComponent', () => {
  let component: TimetableHourDialogComponent;
  let fixture: ComponentFixture<TimetableHourDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimetableHourDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableHourDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
