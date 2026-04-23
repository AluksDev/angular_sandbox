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

    static passwordMatchValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const password = group.get('password')?.value;
            const password_confirm = group.get('password_confirm')?.value;
            if (!password || !password_confirm) return null;
            return password === password_confirm ? null : { passwordMismatch: true }
        }
    }
}