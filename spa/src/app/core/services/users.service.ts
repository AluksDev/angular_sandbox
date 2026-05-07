import { inject, Injectable } from '@angular/core';
import { GetQuery } from '@api/shared/DTOs/api-get-users-query.interface';
import { ApiPaginatedResponse } from '@api/shared/DTOs/api-paginated-response.interface';
import { APIUser } from '@api/users/DTOs/user.interace';
import { GetAllUsersUseCase } from '@api/users/use-cases/get-all-users.use-case';
import { Observable } from 'rxjs';
@Injectable({providedIn: 'root'})
export class UsersService {
    getAllUsersUseCase = inject(GetAllUsersUseCase);
    getAllUsers(options?: GetQuery): Observable<ApiPaginatedResponse<APIUser>> {
        return this.getAllUsersUseCase.execute(options);
    }
}