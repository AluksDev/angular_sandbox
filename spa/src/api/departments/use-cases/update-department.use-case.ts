import { inject, Injectable } from '@angular/core';
import { DepartmentsRepository } from '../repository/departments.repository';
import { Observable } from 'rxjs';
import { Department } from '../DTOs/department.interface';

@Injectable({providedIn: 'root'})
export class UpdateDepartmentUseCase {
    private departmentRepository = inject(DepartmentsRepository);

    execute(dep: Department): Observable<Department>{
        return this.departmentRepository.updateDepartment(dep);
    }
    
}