import { FormGroup, ValidationErrors } from "@angular/forms";

export class FormUtils{
static getFieldError(errors: ValidationErrors) : string | null {
    if (!errors) return null;
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'minlength':
          return `Min length is ${errors['minlength'].requiredLength}`;
        case 'min':
          return `Min value is ${errors['min'].min}`;
        case 'email':
          return 'Invalid email';
        case 'emailTaken':
          return 'Email already in use';
        case 'noStrider':
          return 'Strider is not allowed';
      }
    }
    return null;
}
}