import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalSidebarComponent } from './global-sidebar.component';

describe('GlobalSidebarComponent', () => {
  let component: GlobalSidebarComponent;
  let fixture: ComponentFixture<GlobalSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GlobalSidebarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
