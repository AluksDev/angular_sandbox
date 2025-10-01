import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslationDetailsComponent } from './translation-details.component';

describe('TranslationDetailsComponent', () => {
  let component: TranslationDetailsComponent;
  let fixture: ComponentFixture<TranslationDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslationDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
