import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";


export class FormUtils {

    // Expresiones regulares

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

        return Object.entries(form.controls).every(([key, control]) => {
            const isValid = this.isNotValidField(form, key);
            return isValid;
        });

    }

}