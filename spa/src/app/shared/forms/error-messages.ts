import { ValidationErrors } from "@angular/forms";

export class ErrorMessages {
    static getErrorMessage(errors: ValidationErrors | null): string | null {
        if (!errors) return null;
        for (const key of Object.keys(errors)){
            switch (key) {
            case 'required':
                return 'This field is required';
            case 'minlength':
                return `Minimum length required is ${errors[key].requiredLength} characters`
            case 'maxlength':
                return "Maximum length reached"
            case 'email':
                return 'It must be a valid email'
            case 'patternInvalid':
                return 'Invalid pattern'
            case 'passwordMismatch':
                return 'Passwords do not match'
            case 'usernameUnique':
                return 'Username already in use'
            case 'emailUnique':
                return 'Email already in use'
            }
        }
    }
}