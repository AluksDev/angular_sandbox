import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { YesNoDialogComponent } from './yesno.component';

describe('YesNoDialogComponent', () => {
  let component: YesNoDialogComponent;
  let fixture: ComponentFixture<YesNoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [YesNoDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YesNoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
