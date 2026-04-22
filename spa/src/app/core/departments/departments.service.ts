import { inject, Injectable } from '@angular/core';
import { CreateDepartment, Department } from '@api/departments/DTOs/department.interface';
import { AddDepartmentUseCase } from '@api/departments/use-cases/add-department.use-case';
import { DeleteDepartmentByIdUseCase } from '@api/departments/use-cases/delete-department-by-id.use-case';
import { GetDepartmentByIdUseCase } from '@api/departments/use-cases/get-department-by-id.use-case';
import { GetDepartmentsUseCase } from '@api/departments/use-cases/get-departments.use-case';
import { UpdateDepartmentUseCase } from '@api/departments/use-cases/update-department.use-case';
import { ApiPaginatedResponse } from '@api/shared/DTOs/api-paginated-response.interface';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DepartmentsService {
    getDepartmentsUseCase = inject(GetDepartmentsUseCase);
    addDepartmentUseCase = inject(AddDepartmentUseCase);
    deleteDepartmentByIdUseCase = inject(DeleteDepartmentByIdUseCase);
    updateDepartmentUseCase = inject(UpdateDepartmentUseCase);
    getDepartmentByIdUseCase = inject(GetDepartmentByIdUseCase);


    getDepartments(): Observable<ApiPaginatedResponse<Department>> {
        return this.getDepartmentsUseCase.execute();
    }

    addDepartment(newDep: CreateDepartment): Observable<Department>{
        return this.addDepartmentUseCase.execute(newDep);
    }

    deleteDepartmentById(id: number): Observable<void>{
        return this.deleteDepartmentByIdUseCase.execute(id);
    }

    updateDepartment(dep: Department): Observable<Department>{
        return this.updateDepartmentUseCase.execute(dep);
    }
    
    getDepartmentById(depId: number): Observable<Department> {
        return this.getDepartmentByIdUseCase.execute(depId);
    }
}