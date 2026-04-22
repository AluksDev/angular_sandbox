import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {
    static validatePatter(pattern: string): ValidatorFn{
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            const regex = new RegExp(pattern);
            const valid = regex.test(control.value);
            return valid ? null : { patternInvalid: true }
        }
    }
}