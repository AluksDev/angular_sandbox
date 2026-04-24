import { Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { UserRepository } from "../repository/user.repository";
import { ApiPaginatedResponse } from "@api/shared/DTOs/api-paginated-response.interface";
import { APIUser } from "../DTOs/user.interace";


@Injectable({providedIn: 'root'})
export class GetAllUsersUseCase {
    userRepository = inject(UserRepository);
    
    execute(): Observable<ApiPaginatedResponse<APIUser>> {
        return this.userRepository.getAllUsers();
    }
}