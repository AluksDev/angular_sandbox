import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { APIUser } from '@api/users/DTOs/user.interace';
import { DepartmentsService } from './departments.service';
import { Department } from '@api/departments/DTOs/department.interface';

@Injectable({ providedIn: 'root' })
export class DepartmentResolver implements Resolve<any> {
    departmentService = inject(DepartmentsService);
    router = inject(Router);
    resolve(route: ActivatedRouteSnapshot): Observable<Department>{
        const id = Number(route.paramMap.get('id'));
        return this.departmentService.getDepartmentById(id).pipe(
            catchError((err)=>{
                if (err.status === 404){
                    this.router.navigate(['/404'], {
                        queryParams: {returnUrl: '/departments'}
                    });
                }
                return EMPTY;
            })
        );
    }
}