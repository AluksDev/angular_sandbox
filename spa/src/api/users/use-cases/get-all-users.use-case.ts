import { Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { UserRepository } from "../repository/user.repository";
import { ApiPaginatedResponse } from "@api/shared/DTOs/api-paginated-response.interface";
import { APIUser } from "../DTOs/user.interace";
import { GetUsersQuery } from "@api/shared/DTOs/api-get-users-query.interface";


@Injectable({providedIn: 'root'})
export class GetAllUsersUseCase {
    userRepository = inject(UserRepository);
    
    execute(options?: GetUsersQuery): Observable<ApiPaginatedResponse<APIUser>> {
        return this.userRepository.getAllUsers(options);
    }
}