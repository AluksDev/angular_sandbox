import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIUser, User } from '../DTOs/user.interace';

@Injectable({providedIn: 'root'})
export class UserRepository {
    http = inject(HttpClient);
    assignDepartmentToCurrentUser(user:User, departmentId: number): Observable<APIUser>{
        const { id, username } = user;
        return this.http.patch<APIUser>(`/services/sandbox/user/${id}/`, {
            username: username,
            department: departmentId
        })
    }
    
}