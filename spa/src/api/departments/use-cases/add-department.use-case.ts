import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DepartmentsRepository } from "../repository/departments.repository";
import { Department } from "../DTOs/department.interface";

@Injectable({
  providedIn: "root",
})
export class AddDepartmentUseCase {
  private departmentsRepository = inject(DepartmentsRepository);

  execute(newDep: Department): Observable<Department> {
    return this.departmentsRepository.addDepartment(newDep);
  }
}