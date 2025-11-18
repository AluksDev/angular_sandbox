import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DepartmentService } from "@modules/departments/department.service";
import { of } from "rxjs";

const dialogRefMock = {
  close: jest.fn()
};

const mockDepartmentService = {
  delete: jest.fn(() => of({ id: 99, name: 'Test' })),
};

describe('DepartmentDialog', () => {
    let fixture: ComponentFixture<ConfirmationDialogComponent>;
    let component: ConfirmationDialogComponent;

    
    beforeEach(async () => {
        TestBed.configureTestingModule({
        imports: [ConfirmationDialogComponent],
        
        providers: [
            { provide: MatDialogRef, useValue: dialogRefMock },
            { provide: MAT_DIALOG_DATA, useValue: { 
                title: 'Confirmación de Eliminación',
                message: '¿Está absolutamente seguro de que desea eliminar este departamento?',
                itemName: 'Recursos Humanos',
                id: 1
            } },
            { provide: DepartmentService, useValue: mockDepartmentService }
        ]

        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmationDialogComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });


    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should call dialogRef.close() before clicking "Cerrar"', () => {
        const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.app-button-cancel');

        closeButton.click();
        
        expect(dialogRefMock.close).toHaveBeenCalled(); 
    });

    it('should call DepartmentService.delete and close the dialog', () => {
        
        const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('.app-button-confirm');

        saveButton.click();
        expect(mockDepartmentService.delete).toHaveBeenCalledTimes(1);
        
        expect(dialogRefMock.close).toHaveBeenCalledWith();
    });



})