import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../repository/auth.repository';
import { Observable } from 'rxjs';
import { ApiUserRegister } from '../DTOs/auth.interface';
import { User } from '@api/users/DTOs/user.interace';

@Injectable({providedIn: 'root'})
export class RegistertUseCase {
    authRepository = inject(AuthRepository);

    execute(data: ApiUserRegister): Observable<{token: string; user: User}> {
        return this.authRepository.register(data);
    }
    
}