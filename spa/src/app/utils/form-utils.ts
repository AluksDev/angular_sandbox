import { inject } from "@angular/core";
import { AbstractControl, AsyncValidator, AsyncValidatorFn, FormGroup, ValidationErrors } from "@angular/forms";
import { UserResponse } from "@api/defs/User";
import { UserService } from "@app/services/user.service";
import { catchError, Observable, of, map, tap } from "rxjs";


export class FormUtils {

    // Patterns
    static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

    static uppercasePattern = '^(?=.*[A-Z]).+$'; 
    static numberPattern = '^(?=.*[0-9]).+$'; 
    static specialPattern = '^(?=.*[^A-Za-z0-9]).+$';

    userService = inject(UserService);

    /**
     *  Returns the user-friendly error message
     * @param fieldName - The name of the form field to retrieve the error message for.
     * @param errors - An object containing the validation errors of the field.
     * 
     * @return A string representing the error message to display for the specified field.
     * */ 
    static getTextError(fieldName: string, errors: ValidationErrors) {
        for (const key of Object.keys(errors)){
        switch(key) {
            case 'required':
                return `El campo ${fieldName} es requerido`;
            case 'minlength':
                return `Minimo de ${errors['minlength'].requiredLength} caracteres`;
            case 'min':
                return `Valor minimo de ${errors['min'].min}`;
            case 'pattern':
                if (  errors['pattern'].requiredPattern == FormUtils.emailPattern) {
                    return 'El correo ingresado no luce como un correo electronico';
                }

                if (  errors['pattern'].requiredPattern == FormUtils.uppercasePattern) {
                    return 'Al menos una mayúscula';
                }

                if (  errors['pattern'].requiredPattern == FormUtils.numberPattern) {
                    return 'Al menos un número';
                }

                if (  errors['pattern'].requiredPattern == FormUtils.specialPattern) {
                    return 'Al menos un carácter especial';
                }

                return 'Error de patron contra expresion regular';
            
            case 'errorName':
                return `Este ${fieldName} ya está en uso`

            default:
                return 'Erro de validacion no controlado';
        }
        }

        return null;
    }


    /**
     *  Checks if a specific field in the form is invalid and has been interacted with.
     * @param form - The FormGroup containing the form controls.
     * @param fieldname - The name of the form control to check.
     * @returns `true` if the field is invalid and touched or dirty; otherwise `false`
     */
    static isNotValidField(form: FormGroup, fieldname: string) : boolean {
        return (
            !!form.controls[fieldname].errors && 
            form.controls[fieldname].touched) ;

    }
    
    /**
     * Retrieves the error message for a specific form field, if any.
     * @param form - The FormGroup containing the form controls.
     * @param fieldName - The name of the form field to retrieve the error message for.
     * @returns A string representing the error message to display for the specified field.
     */
    static getFieldError(form: FormGroup, fieldName: string): string | null {
        if (!form.controls[fieldName] ) return null;

        const errors = form.controls[fieldName].errors ?? {};


        return FormUtils.getTextError(fieldName, errors);
        
    }

    /**
     * Checks if none inputs in the form are empty or invalid).
     *
     * @param form - The FormGroup representing the form to check.
     *
     * @returns `false` if all inputs have values are valid; otherwise, `true`.
     */
    static allInputsRequired(form: FormGroup){

        return Object.entries(form.controls).every(([key]) => {
            const isValid = this.isNotValidField(form, key);
            return isValid;
        });

    }

    /**
     * @description Custom validator function to check if the values of two form controls within a FormGroup are equal.
     * This is commonly used for password confirmation fields.
     * @param {string} field1 The name of the first form control
     * @param {string} field2 The name of the second form control
     * @returns {(formGroup: AbstractControl) => ValidationErrors | null} A validator function that takes an AbstractControl
     * and returns null if the fields are equal, or a ValidationErrors object if they are not.
     */
    static isFieldOneEqualFieldTwo( field1: string, field2 :string ){
        return ( formGroup: AbstractControl) => {
        const field1Value = formGroup.get(field1)?.value;
        const field2Value = formGroup.get(field2)?.value;
        
        return  field1Value == field2Value ? null : { passwordsNotEqual: true};
        }
    }

    static uniqueValueValidator(userService: UserService): AsyncValidatorFn {
    
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            
            if (!control.value) {
                return of(null);
            }
            
            return userService.getUsers({ search: control.value }).pipe(
                map((resp: UserResponse) => {
                    if (resp.count === 0) {
                        return null;
                    } else {
                        return { errorName: true };
                    }
                }),

                catchError(() => of(null)) 
            );
        };
    }

}