import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoResultsComponent } from './no-results.component';

describe('NoResultsComponent', () => {
  let component: NoResultsComponent;
  let fixture: ComponentFixture<NoResultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoResultsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
