import { inject, Injectable } from '@angular/core';
import { User } from '@api/users/DTOs/user.interace';
import { AssignDepartmentToCurrentUserUseCase } from '@api/users/use-cases/assign-department-to-current-user.use-case';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {
    assignDepartmentToCurrentUserUseCase = inject(AssignDepartmentToCurrentUserUseCase);
    assignDepartmentToCurrentUser(departmentId: number): Observable<User> {
        return this.assignDepartmentToCurrentUserUseCase.execute(departmentId);
    }
}