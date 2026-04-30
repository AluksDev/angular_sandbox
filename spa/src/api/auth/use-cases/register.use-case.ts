import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../repository/auth.repository';
import { Observable } from 'rxjs';
import { APIUser } from '@api/users/DTOs/user.interace';

@Injectable({providedIn: 'root'})
export class RegistertUseCase {
    authRepository = inject(AuthRepository);

    execute(data: APIUser & {password: string, password_confirm: string}): Observable<{token: string; user: APIUser}> {
        return this.authRepository.register(data);
    }
    
}