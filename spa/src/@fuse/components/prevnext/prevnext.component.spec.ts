import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrevNextComponent } from './prevnext.component';

describe('PrevNextComponent', () => {
  let component: PrevNextComponent;
  let fixture: ComponentFixture<PrevNextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PrevNextComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
