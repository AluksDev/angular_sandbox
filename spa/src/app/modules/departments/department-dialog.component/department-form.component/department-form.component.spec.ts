import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DepartmentFormComponent } from "./department-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Component, ViewChild } from "@angular/core";
import { FormUtils } from "@utils/form-utils";
import { DepartmentCreate } from "@api/defs/Department";




describe('DepartmentFormComponent with empty input', () => {
    let fixture: ComponentFixture<DepartmentFormComponent>;
    let component: DepartmentFormComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        imports: [FormsModule, DepartmentFormComponent, ReactiveFormsModule],
        providers: [FormUtils], 
        }).compileComponents();

        fixture = TestBed.createComponent(DepartmentFormComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should be invalid if name empty', () => {
        expect(component.departmentForm.valid).toBeFalsy(); 
        
        const controlName = component.departmentForm.get("name");
        expect(controlName?.value).toBe('');
        expect(controlName?.valid).toBeFalsy();

        const errorMessage = fixture.nativeElement.querySelector('.error-message');
        expect(errorMessage).toBeFalsy();
    });

    it('should accept a value for name , update the control and form valid', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const inputElement: HTMLInputElement = compiled.querySelector('#name')!;
        
        const newValue = 'Juan Pérez';
        inputElement.value = newValue;
        
        inputElement.dispatchEvent(new Event('input')); 

        fixture.detectChanges(); 

        const controlName = component.departmentForm.get('name');
        
        expect(controlName?.value).toBe(newValue);
        expect(controlName?.valid).toBeTruthy();
        
        expect(component.departmentForm.valid).toBeTruthy();
    });

    it('should show error if name input is empty and touched', () => {
        const isNotValidFieldSpy = jest.spyOn(FormUtils, 'isNotValidField').mockReturnValue(true);
        const getFieldErrorSpy = jest.spyOn(FormUtils, 'getFieldError').mockReturnValue('El nombre es obligatorio.');

        const compiled = fixture.nativeElement;
        const inputElement: HTMLInputElement = compiled.querySelector('#name') as HTMLInputElement;

        inputElement.value = '';
        inputElement.dispatchEvent(new Event('input')); 
        inputElement.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(isNotValidFieldSpy).toHaveBeenCalledWith(component.departmentForm, 'name');
        expect(getFieldErrorSpy).toHaveBeenCalledWith(component.departmentForm, 'name');

        const errorMessage = compiled.querySelector('.error-message');
        expect(errorMessage).toBeTruthy();
        expect(errorMessage?.textContent?.trim()).toBe('El nombre es obligatorio.');

        jest.restoreAllMocks();
    });

    it('should show error if name input length is < 2 and touched', () => {
        const isNotValidFieldSpy = jest.spyOn(FormUtils, 'isNotValidField').mockReturnValue(true);
        const getFieldErrorSpy = jest.spyOn(FormUtils, 'getFieldError').mockReturnValue('Minimo de 2 caracteres');

        const compiled = fixture.nativeElement;
        const inputElement: HTMLInputElement = compiled.querySelector('#name') as HTMLInputElement;

        inputElement.value = 'h';
        inputElement.dispatchEvent(new Event('input')); 
        inputElement.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(isNotValidFieldSpy).toHaveBeenCalledWith(component.departmentForm, 'name');
        expect(getFieldErrorSpy).toHaveBeenCalledWith(component.departmentForm, 'name');

        const errorMessage = compiled.querySelector('.error-message');
        expect(errorMessage).toBeTruthy();
        expect(errorMessage?.textContent?.trim()).toBe('Minimo de 2 caracteres');

        jest.restoreAllMocks();
    });

    it('code should be empty', () => {
        
        const controlName = component.departmentForm.get("code");
        expect(controlName?.value).toBe('');

        const errorMessage = fixture.nativeElement.querySelector('.error-message');
        expect(errorMessage).toBeFalsy();
    });

    it('should accept a value for code, update the control', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const inputElement: HTMLInputElement = compiled.querySelector('#code')!;
        
        const newValue = 'RRHH';
        inputElement.value = newValue;
        
        inputElement.dispatchEvent(new Event('input')); 

        fixture.detectChanges(); 

        const controlName = component.departmentForm.get('code');
        
        expect(controlName?.value).toBe(newValue);
        expect(controlName?.valid).toBeTruthy();
    });

    it('should show error if input is empty and touched', () => {
        const isNotValidFieldSpy = jest.spyOn(FormUtils, 'isNotValidField').mockReturnValue(true);
        const getFieldErrorSpy = jest.spyOn(FormUtils, 'getFieldError').mockReturnValue('El codigo es obligatorio.');

        const compiled = fixture.nativeElement;
        const inputElement: HTMLInputElement = compiled.querySelector('#code') as HTMLInputElement;

        inputElement.value = '';
        inputElement.dispatchEvent(new Event('input')); 
        inputElement.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(isNotValidFieldSpy).toHaveBeenCalledWith(component.departmentForm, 'code');
        expect(getFieldErrorSpy).toHaveBeenCalledWith(component.departmentForm, 'code');

        const errorMessage = compiled.querySelector('.error-message');
        expect(errorMessage).toBeTruthy();
        expect(errorMessage?.textContent?.trim()).toBe('El codigo es obligatorio.');

        jest.restoreAllMocks();
    });

    it('should show error if input length is < 2 and touched', () => {
        const isNotValidFieldSpy = jest.spyOn(FormUtils, 'isNotValidField').mockReturnValue(true);
        const getFieldErrorSpy = jest.spyOn(FormUtils, 'getFieldError').mockReturnValue('Maximo de 50 caracteres');

        const compiled = fixture.nativeElement;
        const inputElement: HTMLInputElement = compiled.querySelector('#code') as HTMLInputElement;

        inputElement.value = '';
        inputElement.dispatchEvent(new Event('input')); 
        inputElement.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(isNotValidFieldSpy).toHaveBeenCalledWith(component.departmentForm, 'code');
        expect(getFieldErrorSpy).toHaveBeenCalledWith(component.departmentForm, 'code');

        const errorMessage = compiled.querySelector('.error-message');
        expect(errorMessage).toBeTruthy();
        expect(errorMessage?.textContent?.trim()).toBe('Maximo de 50 caracteres');

        jest.restoreAllMocks();
    });

})


@Component({
    imports: [DepartmentFormComponent],
    template: `
        <department-form [department]="datosDePrueba" #form></department-form>
    `,
})
class HostComponent {
    @ViewChild('form') departmentFormRef!: DepartmentFormComponent;
    datosDePrueba: DepartmentCreate = {
        name: "Recursos humanos",
        code: "RRHH"
    };
}
describe('DepartmentFormComponent with input', () => {

    let hostFixture: ComponentFixture<HostComponent>;
    let hostComponent: HostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        imports: [FormsModule, DepartmentFormComponent, HostComponent, ReactiveFormsModule],
        providers: [FormUtils], 
        }).compileComponents();

        hostFixture = TestBed.createComponent(HostComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixture.detectChanges();
    });

    it('should create', () => {
        
        expect(hostComponent.departmentFormRef).toBeTruthy();
    });

    it('should be valid', () => {
        
        expect(hostComponent.departmentFormRef.department().name).toBe(hostComponent.datosDePrueba.name);        
        expect(hostComponent.departmentFormRef.department().code).toBe(hostComponent.datosDePrueba.code);        
        expect(hostComponent.departmentFormRef.departmentForm.valid).toBeTruthy(); 
        
        const nameControl = hostComponent.departmentFormRef.departmentForm.get("name");
        expect(nameControl?.value).toBe(hostComponent.datosDePrueba.name);
        expect(nameControl?.valid).toBeTruthy();
        
        const codeControl = hostComponent.departmentFormRef.departmentForm.get("code");
        expect(codeControl?.value).toBe(hostComponent.datosDePrueba.code);
        expect(codeControl?.valid).toBeTruthy();

        const errorMessage = hostFixture.nativeElement.querySelector('.error-message');
        expect(errorMessage).toBeFalsy();
    });

})