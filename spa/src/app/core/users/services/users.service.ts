import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  department: string;
  status: 'active' | 'inactive';
}

interface Options {
    searchTerm?: string,
    department?: number,
    is_active?: boolean,
    limit?: number,
    offset?: number
}

const MOCK_DATA: User[] = [
  {
    id: 1,
    fullName: 'Juan Pérez',
    username: 'jperez',
    email: 'juan.perez@example.com',
    department: 'IT',
    status: 'active'
  },
  {
    id: 2,
    fullName: 'María García',
    username: 'mgarcia',
    email: 'maria.garcia@example.com',
    department: 'HR',
    status: 'inactive'
  },
  {
    id: 3,
    fullName: 'Carlos López',
    username: 'clopez',
    email: 'carlos.lopez@example.com',
    department: 'Finance',
    status: 'active'
  },
  {
    id: 4,
    fullName: 'Ana Torres',
    username: 'atorres',
    email: 'ana.torres@example.com',
    department: 'Marketing',
    status: 'active'
  },
  {
    id: 5,
    fullName: 'Luis Fernández',
    username: 'lfernandez',
    email: 'luis.fernandez@example.com',
    department: 'Sales',
    status: 'inactive'
  }
];

@Injectable({providedIn: 'root'})
export class UsersService {
    private http = inject(HttpClient);

    getUsers(options: Options): Observable<any>{
        const {searchTerm, department, is_active, limit , offset } = options;
        let filteredUsers = MOCK_DATA;

        if (searchTerm){
            let term = searchTerm.toLowerCase();
            filteredUsers = filteredUsers.filter(user =>
                    user.fullName.toLowerCase().includes(term) ||
                    user.username.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term)
                );
        }
        return of(filteredUsers);
    }
    
}