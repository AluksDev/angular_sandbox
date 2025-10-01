import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InlineTranslationDialogComponent } from './inline-translation-dialog.component';

describe('InlineTranslationDialogComponent', () => {
  let component: InlineTranslationDialogComponent;
  let fixture: ComponentFixture<InlineTranslationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [InlineTranslationDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineTranslationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
