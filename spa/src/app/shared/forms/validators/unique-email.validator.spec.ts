import { FormControl } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { UsersService } from '@app/core/services/users.service';
import { of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';

describe('CustomValidators - uniqueEmail', () => {
    let usersService: jasmine.SpyObj<UsersService>;
    let control: FormControl;

    beforeEach(() => {
        usersService = jasmine.createSpyObj('UsersService', ['getAllUsers']);
        control = new FormControl('');
    });

    it('should return null when control value is empty', async () => {
        const validator = CustomValidators.uniqueEmail(usersService);
        control.setValue('');
        
        const result = await firstValueFrom(validator(control) as any);
        expect(result).toBeNull();
        expect(usersService.getAllUsers).not.toHaveBeenCalled();
    });

    it('should return null when email is unique', async () => {
        usersService.getAllUsers.and.returnValue(of({ 
        count: 0, 
        results: [], 
        next: null, 
        previous: null 
        }));
        const validator = CustomValidators.uniqueEmail(usersService);
        control.setValue('newemail@example.com');
        
        const result = await firstValueFrom(validator(control) as any);
        expect(result).toBeNull();
        expect(usersService.getAllUsers).toHaveBeenCalledWith({ search: 'newemail@example.com' });
    });

    it('should return emailUnique error when email already exists', async () => {
        usersService.getAllUsers.and.returnValue(of({ 
        count: 1, 
        results: [{ id: 1, username: 'existing', email: 'existing@example.com' }], 
        next: null, 
        previous: null 
        }));
        const validator = CustomValidators.uniqueEmail(usersService);
        control.setValue('existing@example.com');
        
        const result = await firstValueFrom(validator(control) as any);
        expect(result).toEqual({ emailUnique: true });
        expect(usersService.getAllUsers).toHaveBeenCalledWith({ search: 'existing@example.com' });
    });

    it('should handle service errors gracefully', async () => {
        usersService.getAllUsers.and.returnValue(throwError(() => new Error('Service error')));
        const validator = CustomValidators.uniqueEmail(usersService);
        control.setValue('test@example.com');
        
        const result = await firstValueFrom(validator(control) as any);
        expect(result).toBeNull();
    });
});