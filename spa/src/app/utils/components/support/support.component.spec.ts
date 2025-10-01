import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportVideoComponent } from './support.component';

describe('SupportComponentVideo', () => {
  let component: SupportVideoComponent;
  let fixture: ComponentFixture<SupportVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SupportVideoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
