import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimetableCommentDialogComponent } from './timetable-comment-dialog.component';

describe('TimetableCommentDialogComponent', () => {
  let component: TimetableCommentDialogComponent;
  let fixture: ComponentFixture<TimetableCommentDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimetableCommentDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableCommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
