import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcnPaginatorComponent } from './bcn-paginator.component';

describe('BcnPaginatorComponent', () => {
  let component: BcnPaginatorComponent;
  let fixture: ComponentFixture<BcnPaginatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BcnPaginatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcnPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
