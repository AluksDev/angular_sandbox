import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DepartmentDialogComponent } from "./department-dialog.component";
import { DepartmentFormComponent } from "./department-form.component/department-form.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { of } from "rxjs";
import { DepartmentService } from "../department.service";

const dialogRefMock = {
  close: jest.fn()
};

const mockDepartmentService = {
  create: jest.fn(() => of({ id: 99, name: 'Test' })), 
  update: jest.fn(() => of({ id: 99, name: 'Test' })), 
};

describe('DepartmentDialog', () => {
    let fixture: ComponentFixture<DepartmentDialogComponent>;
    let component: DepartmentDialogComponent;

    
    const configureTestBed = (data: any) => {
        TestBed.configureTestingModule({
        imports: [DepartmentDialogComponent, DepartmentFormComponent],
        
        providers: [
            { provide: MatDialogRef, useValue: dialogRefMock },
            { provide: MAT_DIALOG_DATA, useValue: data },
            { provide: DepartmentService, useValue: mockDepartmentService }
        ]

        }).compileComponents();

        fixture = TestBed.createComponent(DepartmentDialogComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    }


    it('should create the component', () => {
        configureTestBed({ mode: 'create' });
        expect(component).toBeTruthy();
    });

    it('should call dialogRef.close() before clicking "Cerrar"', () => {
        configureTestBed({ mode: 'create' });
        const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.app-button-cancel');

        closeButton.click();
        
        expect(dialogRefMock.close).toHaveBeenCalled(); 
    });

    it('should call al DepartmentService.create and close the dialog', () => {
        configureTestBed({ 
            mode: 'create', 
        });
        const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('.app-button-confirm');

        const form = component.departmentFormRef.departmentForm;
        form.get('name')?.setValue('Ventas');

        fixture.detectChanges();

        saveButton.click(); 
        expect(mockDepartmentService.create).toHaveBeenCalledTimes(1);
        
        expect(dialogRefMock.close).toHaveBeenCalledWith();
    });

    it('should call al DepartmentService.udpate and close the dialog', () => {
        const mockDepartment = { id: 10, name: 'Marketing' };
        
        configureTestBed({ 
            mode: 'edit', 
            department: mockDepartment 
        });
        const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('.app-button-confirm');

        fixture.detectChanges();

        saveButton.click(); 
        expect(mockDepartmentService.update).toHaveBeenCalledTimes(1);
        
        expect(dialogRefMock.close).toHaveBeenCalledWith();
    });

})