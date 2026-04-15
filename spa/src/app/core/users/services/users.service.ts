import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@api/DTOs/user.interface';
import { filter } from 'lodash';
import { Observable, of } from 'rxjs';
interface Options {
  searchTerm?: string,
  department?: number,
  status?: string,
  limit?: number,
  offset?: number,
  sortBy?: string,
  sortOrder?: string
}

const MOCK_USERS_DATA: User[] = [
  { id: 1, fullName: 'Juan Pérez', username: 'jperez', email: 'juan.perez@example.com', department: 1, status: 'active' },
  { id: 2, fullName: 'María García', username: 'mgarcia', email: 'maria.garcia@example.com', department: 2, status: 'inactive' },
  { id: 3, fullName: 'Carlos López', username: 'clopez', email: 'carlos.lopez@example.com', department: 3, status: 'active' },
  { id: 4, fullName: 'Ana Torres', username: 'atorres', email: 'ana.torres@example.com', department: 4, status: 'active' },
  { id: 5, fullName: 'Luis Fernández', username: 'lfernandez', email: 'luis.fernandez@example.com', department: 5, status: 'inactive' },
  { id: 6, fullName: 'Sofía Ruiz', username: 'sruiz', email: 'sofia.ruiz@example.com', department: 1, status: 'active' },
  { id: 7, fullName: 'Miguel Ramírez', username: 'mramirez', email: 'miguel.ramirez@example.com', department: 2, status: 'inactive' },
  { id: 8, fullName: 'Isabel Moreno', username: 'imoreno', email: 'isabel.moreno@example.com', department: 3, status: 'active' },
  { id: 9, fullName: 'Javier Castillo', username: 'jcastillo', email: 'javier.castillo@example.com', department: 4, status: 'active' },
  { id: 10, fullName: 'Laura Ortega', username: 'lortega', email: 'laura.ortega@example.com', department: 5, status: 'inactive' },
  { id: 11, fullName: 'Fernando Díaz', username: 'fdiaz', email: 'fernando.diaz@example.com', department: 1, status: 'active' },
  { id: 12, fullName: 'Paula Soto', username: 'psoto', email: 'paula.soto@example.com', department: 2, status: 'inactive' },
  { id: 13, fullName: 'Alberto Jiménez', username: 'ajimenez', email: 'alberto.jimenez@example.com', department: 3, status: 'active' },
  { id: 14, fullName: 'Natalia Herrera', username: 'nherrera', email: 'natalia.herrera@example.com', department: 4, status: 'active' },
  { id: 15, fullName: 'Diego Vargas', username: 'dvargas', email: 'diego.vargas@example.com', department: 5, status: 'inactive' },
  { id: 16, fullName: 'Camila Molina', username: 'cmolina', email: 'camila.molina@example.com', department: 1, status: 'active' },
  { id: 17, fullName: 'Ricardo Navarro', username: 'rnavarro', email: 'ricardo.navarro@example.com', department: 2, status: 'inactive' },
  { id: 18, fullName: 'Valentina Cruz', username: 'vcruz', email: 'valentina.cruz@example.com', department: 3, status: 'active' },
  { id: 19, fullName: 'Santiago Rojas', username: 'srojas', email: 'santiago.rojas@example.com', department: 4, status: 'active' },
  { id: 20, fullName: 'Daniela Paredes', username: 'dparedes', email: 'daniela.paredes@example.com', department: 5, status: 'inactive' },
  { id: 21, fullName: 'Andrés León', username: 'aleon', email: 'andres.leon@example.com', department: 1, status: 'active' },
  { id: 22, fullName: 'Gabriela Fuentes', username: 'gfuentes', email: 'gabriela.fuentes@example.com', department: 2, status: 'inactive' },
  { id: 23, fullName: 'Martín Campos', username: 'mcampos', email: 'martin.campos@example.com', department: 3, status: 'active' },
  { id: 24, fullName: 'Lucía Castro', username: 'lcastro', email: 'lucia.castro@example.com', department: 4, status: 'active' },
  { id: 25, fullName: 'Emiliano Vargas', username: 'evargas', email: 'emiliano.vargas@example.com', department: 5, status: 'inactive' },
  { id: 26, fullName: 'Marina Soto', username: 'msoto', email: 'marina.soto@example.com', department: 1, status: 'active' },
  { id: 27, fullName: 'Pablo Herrera', username: 'pherrera', email: 'pablo.herrera@example.com', department: 2, status: 'inactive' },
  { id: 28, fullName: 'Cecilia Ramírez', username: 'cramirez', email: 'cecilia.ramirez@example.com', department: 3, status: 'active' },
  { id: 29, fullName: 'Alejandro Castillo', username: 'acastillo', email: 'alejandro.castillo@example.com', department: 4, status: 'active' },
  { id: 30, fullName: 'Carolina Vargas', username: 'cvargas', email: 'carolina.vargas@example.com', department: 5, status: 'inactive' },
  { id: 31, fullName: 'Héctor Molina', username: 'hmolina', email: 'hector.molina@example.com', department: 1, status: 'active' },
  { id: 32, fullName: 'Patricia Navarro', username: 'pnavarro', email: 'patricia.navarro@example.com', department: 2, status: 'inactive' },
  { id: 33, fullName: 'Esteban Cruz', username: 'ecruz', email: 'esteban.cruz@example.com', department: 3, status: 'active' },
  { id: 34, fullName: 'Fernanda Rojas', username: 'frojas', email: 'fernanda.rojas@example.com', department: 4, status: 'active' },
  { id: 35, fullName: 'Oscar Paredes', username: 'oparedes', email: 'oscar.paredes@example.com', department: 5, status: 'inactive' },
  { id: 36, fullName: 'Renata León', username: 'rleon', email: 'renata.leon@example.com', department: 1, status: 'active' },
  { id: 37, fullName: 'Andres Fuentes', username: 'afuentes', email: 'andres.fuentes@example.com', department: 2, status: 'inactive' },
  { id: 38, fullName: 'Mónica Campos', username: 'mcampos', email: 'monica.campos@example.com', department: 3, status: 'active' },
  { id: 39, fullName: 'Jorge Castro', username: 'jcastro', email: 'jorge.castro@example.com', department: 4, status: 'active' },
  { id: 40, fullName: 'Daniela Vargas', username: 'dvargas2', email: 'daniela.vargas2@example.com', department: 5, status: 'inactive' },
  { id: 41, fullName: 'Ricardo Molina', username: 'rmolina', email: 'ricardo.molina@example.com', department: 1, status: 'active' },
  { id: 42, fullName: 'Camila Navarro', username: 'cnavarro', email: 'camila.navarro@example.com', department: 2, status: 'inactive' },
  { id: 43, fullName: 'Santiago Cruz', username: 'scruz', email: 'santiago.cruz@example.com', department: 3, status: 'active' },
  { id: 44, fullName: 'Natalia Rojas', username: 'nrojas', email: 'natalia.rojas@example.com', department: 4, status: 'active' },
  { id: 45, fullName: 'Diego Paredes', username: 'dparedes2', email: 'diego.paredes2@example.com', department: 5, status: 'inactive' },
  { id: 46, fullName: 'Lucía León', username: 'lleon', email: 'lucia.leon@example.com', department: 1, status: 'active' },
  { id: 47, fullName: 'Miguel Fuentes', username: 'mfuentes', email: 'miguel.fuentes@example.com', department: 2, status: 'inactive' },
  { id: 48, fullName: 'Isabel Campos', username: 'icampos', email: 'isabel.campos@example.com', department: 3, status: 'active' },
  { id: 49, fullName: 'Javier Castro', username: 'jcastro2', email: 'javier.castro2@example.com', department: 4, status: 'active' },
  { id: 50, fullName: 'Laura Vargas', username: 'lvargas', email: 'laura.vargas@example.com', department: 5, status: 'inactive' }
];
@Injectable({providedIn: 'root'})
export class UsersService {
    private http = inject(HttpClient);

    getUsers(options: Options): Observable<{data: User[], total: number}>{
        console.log(options)
        const {searchTerm, department, status, limit , offset, sortBy } = options;
        let filteredUsers = MOCK_USERS_DATA;

        if (searchTerm){
            let term = searchTerm.toLowerCase();
            filteredUsers = filteredUsers.filter(user =>
                    user.fullName.toLowerCase().includes(term) ||
                    user.username.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term)
                );
        }
        if (department){
            filteredUsers = filteredUsers.filter(user => 
                user.department === department
            );
        }
        if (status) {
            filteredUsers = filteredUsers.filter(user => (
                user.status === status
            ));
        }

       if (sortBy) {
            const sortOrder = options.sortOrder || 'asc';
            filteredUsers = filteredUsers.sort((a: any, b: any) => {
                const aValue = a[sortBy];
                const bValue = b[sortBy];
                
                if (typeof aValue === 'string') {
                return sortOrder === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
                }                
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            });
        }

        const total = filteredUsers.length;
        filteredUsers = filteredUsers.slice(offset, offset + limit);
        return of({data: filteredUsers, total});
    }
}