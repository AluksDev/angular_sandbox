import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../repository/user.repository';
import { APIUser } from '../DTOs/user.interace';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UpdateUserUseCase {
    userRepository = inject(UserRepository);

    execute(id: number, data: APIUser): Observable<APIUser> {
        return this.userRepository.updateUser(id, data);
    }
}