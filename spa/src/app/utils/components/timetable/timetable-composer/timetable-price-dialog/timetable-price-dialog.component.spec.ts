import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimetablePriceDialogComponent } from './timetable-price-dialog.component';

describe('TimetablePriceDialogComponent', () => {
  let component: TimetablePriceDialogComponent;
  let fixture: ComponentFixture<TimetablePriceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimetablePriceDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetablePriceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
