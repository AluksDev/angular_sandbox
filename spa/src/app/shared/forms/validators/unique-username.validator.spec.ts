import { FormControl } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { UsersService } from '@app/core/services/users.service';
import { of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';

describe('CustomValidators - uniqueUsername', () => {
    let usersService: jasmine.SpyObj<UsersService>;
    let control: FormControl;

    beforeEach(() => {
        usersService = jasmine.createSpyObj('UsersService', ['getAllUsers']);
        control = new FormControl('');
    });

    it('should return null when control value is empty', async () => {
        const validator = CustomValidators.uniqueUsername(usersService);
        control.setValue('');
        
        const result = await firstValueFrom(validator(control) as any);
        expect(result).toBeNull();
        expect(usersService.getAllUsers).not.toHaveBeenCalled();
    });

    it('should return null when username is unique', async () => {
        usersService.getAllUsers.and.returnValue(of({ 
        count: 0, 
        results: [], 
        next: null, 
        previous: null 
        }));
        const validator = CustomValidators.uniqueUsername(usersService);
        control.setValue('newUsername');
        
        const result = await firstValueFrom(validator(control) as any);
        expect(result).toBeNull();
        expect(usersService.getAllUsers).toHaveBeenCalledWith({ search: 'newUsername' });
    });

    it('should return usernameUnique error when username already exists', async () => {
        usersService.getAllUsers.and.returnValue(of({ 
        count: 1, 
        results: [{ id: 1, username: 'existingUser', email: 'existing@example.com' }], 
        next: null, 
        previous: null 
        }));
        const validator = CustomValidators.uniqueUsername(usersService);
        control.setValue('existingUser');
        
        const result = await firstValueFrom(validator(control) as any);
        expect(result).toEqual({ usernameUnique: true });
        expect(usersService.getAllUsers).toHaveBeenCalledWith({ search: 'existingUser' });
    });

    it('should handle service errors gracefully', async () => {
        usersService.getAllUsers.and.returnValue(throwError(() => new Error('Service error')));
        const validator = CustomValidators.uniqueUsername(usersService);
        control.setValue('testUser');
        
        const result = await firstValueFrom(validator(control) as any);
        expect(result).toBeNull();
    });
});