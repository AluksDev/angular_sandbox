import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIUser, CreateUser, UpdateUser, User } from '../DTOs/user.interace';
import { ApiPaginatedResponse } from '@api/shared/DTOs/api-paginated-response.interface';
import { GetUsersQuery } from '@api/shared/DTOs/api-get-users-query.interface';

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

    getAllUsers(options?: GetUsersQuery): Observable<ApiPaginatedResponse<APIUser>> {
        let params = new HttpParams();

        if (options?.search) params = params.set('search', options.search);
        if (options?.department) params = params.set('department', options.department);
        if (options?.is_active !== undefined) params = params.set('is_active', options.is_active);
        if (options?.limit) params = params.set('limit', options.limit);
        if (options?.offset) params = params.set('offset', options.offset);
        if (options?.fields) params = params.set('fields', options.fields);
        if (options?.expand) params = params.set('expand', options.expand);
        if (options?.ordering) params = params.set('ordering', options.ordering);
        return this.http.get<ApiPaginatedResponse<APIUser>>(
            '/services/sandbox/user/',
            { params }
        );
    }

    getUserById(id: number): Observable<APIUser> {
        return this.http.get<APIUser>(`/services/sandbox/user/${id}/`);
    }

    updateUser(id: number, data: UpdateUser): Observable<APIUser> {
        return this.http.patch<APIUser>(`/services/sandbox/user/${id}/`, data);
    }
}