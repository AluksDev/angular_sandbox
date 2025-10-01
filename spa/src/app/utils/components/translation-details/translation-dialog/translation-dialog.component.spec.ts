import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslationDialogComponent } from './translation-dialog.component';

describe('TranslationDialogComponent', () => {
  let component: TranslationDialogComponent;
  let fixture: ComponentFixture<TranslationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslationDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
