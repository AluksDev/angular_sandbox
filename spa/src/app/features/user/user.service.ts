import { inject, Injectable } from '@angular/core';
import { APIUser } from '@api/users/DTOs/user.interace';
import { AssignDepartmentToCurrentUserUseCase } from '@api/users/use-cases/assign-department-to-current-user.use-case';
import { CreateUserUseCase } from '@api/users/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '@api/users/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '@api/users/use-cases/update-user.use-case';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {
    assignDepartmentToCurrentUserUseCase = inject(AssignDepartmentToCurrentUserUseCase);
    assignDepartmentToCurrentUser(departmentId: number): Observable<APIUser> {
        return this.assignDepartmentToCurrentUserUseCase.execute(departmentId);
    }

    createUserUseCase = inject(CreateUserUseCase);
    createUser(userData: APIUser & { password:string, password_confirm: string }): Observable<APIUser> {
        return this.createUserUseCase.execute(userData);
    }

    getUserByIdUseCase = inject(GetUserByIdUseCase);
    getUserById(id: number): Observable<APIUser> {
        return this.getUserByIdUseCase.execute(id);
    }

    updateUserUseCase = inject(UpdateUserUseCase);
    updateUser(id: number, data: APIUser): Observable<APIUser> {
        return this.updateUserUseCase.execute(id, data);
    }
}