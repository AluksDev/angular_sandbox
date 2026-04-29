import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../repository/user.repository';
import { APIUser, UpdateUser } from '../DTOs/user.interace';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UpdateUserUseCase {
    userRepository = inject(UserRepository);

    execute(id: number, data: UpdateUser): Observable<APIUser> {
        return this.userRepository.updateUser(id, data);
    }
}