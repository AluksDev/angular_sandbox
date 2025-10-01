import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StillHereComponent } from '@utils/components/still-here/still-here.component';

describe('SortingComponent', () => {
  let component: StillHereComponent;
  let fixture: ComponentFixture<StillHereComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StillHereComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StillHereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
