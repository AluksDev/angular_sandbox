import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../repository/user.repository';
import { Observable } from 'rxjs';
import { APIUser } from '../DTOs/user.interace';

@Injectable({providedIn: 'root'})
export class GetUserByIdUseCase {
    userRepository = inject(UserRepository);

    execute(id: number): Observable<APIUser> {
        return this.userRepository.getUserById(id);
    }
}