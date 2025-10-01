import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimetablePeriodDialogComponent } from './timetable-period-dialog.component';

describe('TimetablePeriodDialogComponent', () => {
  let component: TimetablePeriodDialogComponent;
  let fixture: ComponentFixture<TimetablePeriodDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimetablePeriodDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetablePeriodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
