import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimetableComposerComponent } from './timetable-composer.component';

describe('TimetableComposerComponent', () => {
  let component: TimetableComposerComponent;
  let fixture: ComponentFixture<TimetableComposerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimetableComposerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
