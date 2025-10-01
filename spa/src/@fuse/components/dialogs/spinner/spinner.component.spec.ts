import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpinnerDialogComponent } from './spinner.component';

describe('SpinnerDialogComponent', () => {
  let component: SpinnerDialogComponent;
  let fixture: ComponentFixture<SpinnerDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SpinnerDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
