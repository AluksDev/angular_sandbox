import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIUser, CreateUser, User } from '../DTOs/user.interace';
import { ApiPaginatedResponse } from '@api/shared/DTOs/api-paginated-response.interface';

@Injectable({providedIn: 'root'})
export class UserRepository {
    http = inject(HttpClient);
    assignDepartmentToCurrentUser(user:APIUser, departmentId: number): Observable<APIUser>{
        const { id, username } = user;
        return this.http.patch<APIUser>(`/services/sandbox/user/${id}/`, {
            username: username,
            department: departmentId
        })
    }

    createUser(userData: CreateUser): Observable<APIUser> {
        return this.http.post<APIUser>("/services/sandbox/user/", userData);
    }

    getAllUsers(): Observable<ApiPaginatedResponse<APIUser>>{
        return this.http.get<ApiPaginatedResponse<APIUser>>("/services/sandbox/user/");
    }
}