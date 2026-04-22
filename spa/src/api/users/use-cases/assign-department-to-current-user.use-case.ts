import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../repository/user.repository';
import { map, Observable, switchMap, take, tap } from 'rxjs';
import { AuthService } from '@app/core/auth/auth.service';
import { User } from '../DTOs/user.interace';
import { mapApiUserToUser } from '@app/core/user/user.mapper';

@Injectable({providedIn: 'root'})
export class AssignDepartmentToCurrentUserUseCase {
    userRepository = inject(UserRepository);
    authService = inject(AuthService);
    
    execute(departmentId: number): Observable<User> {
        return this.authService.currentUser$.pipe(
            take(1),
            switchMap((user) => {
            if (!user) throw new Error('No user logged in');

            return this.userRepository.assignDepartmentToCurrentUser(user, departmentId);
            }),
            map((apiUpdatedUser) => mapApiUserToUser(apiUpdatedUser)),
            tap((updatedUser) => {
            this.authService.setCurrentUser(updatedUser);
            })
        );
    }
}