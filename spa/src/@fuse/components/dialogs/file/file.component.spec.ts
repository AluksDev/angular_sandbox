import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDialogComponent } from './file.component';

describe('FileComponent', () => {
  let component: FileDialogComponent;
  let fixture: ComponentFixture<FileDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FileDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
