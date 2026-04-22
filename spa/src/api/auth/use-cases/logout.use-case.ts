import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../repository/auth.repository';
import { Observable } from 'rxjs';
import { APILogoutResponse } from '../DTOs/auth.interface';

@Injectable({providedIn: 'root'})
export class LogoutUseCase {
    authRepository = inject(AuthRepository);

    execute(): Observable<APILogoutResponse> {
        return this.authRepository.logout();
    }
    
}