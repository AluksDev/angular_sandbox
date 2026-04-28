import { inject, Injectable } from '@angular/core';
import { APIUser, CreateUser, User } from '@api/users/DTOs/user.interace';
import { AssignDepartmentToCurrentUserUseCase } from '@api/users/use-cases/assign-department-to-current-user.use-case';
import { CreateUserUseCase } from '@api/users/use-cases/create-user.use-case';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {
    assignDepartmentToCurrentUserUseCase = inject(AssignDepartmentToCurrentUserUseCase);
    assignDepartmentToCurrentUser(departmentId: number): Observable<APIUser> {
        return this.assignDepartmentToCurrentUserUseCase.execute(departmentId);
    }

    createUserUseCase = inject(CreateUserUseCase);
    createUser(userData: CreateUser): Observable<APIUser> {
        return this.createUserUseCase.execute(userData);
    }
}