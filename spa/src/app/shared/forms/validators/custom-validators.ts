import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { UsersService } from "@app/core/services/users.service";
import { catchError, map, of, switchMap, timer } from "rxjs";

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

    static uniqueUsername(usersService: UsersService): AsyncValidatorFn {
        return (control: AbstractControl) => {
            if (!control.value) return of(null);
            return timer(300).pipe(
                switchMap(() =>
                    usersService.getAllUsers({ search: control.value }).pipe(
                        map(user =>
                            user.count > 0 ? { usernameUnique: true } : null
                        ),
                        catchError(() => of(null))
                    )
                )
            );
        };
    }

    static uniqueEmail(usersService: UsersService): AsyncValidatorFn {
        return (control: AbstractControl) => {
            if (!control.value) return of(null);
            return timer(300).pipe(
                switchMap(() =>
                    usersService.getAllUsers({ search: control.value }).pipe(
                        map(user =>
                            user.count > 0 ? { emailUnique: true } : null
                        ),
                        catchError(() => of(null))
                    )
                )
            );
        };
    }
}