import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DepartmentsRepository } from "../repository/departments.repository";
import { Department } from "../DTOs/department.interface";

@Injectable({
  providedIn: "root",
})
export class GetDepartmentByIdUseCase {
  private departmentsRepository = inject(DepartmentsRepository);

  execute(depId: number): Observable<Department> {
    return this.departmentsRepository.getDepartmentById(depId);
  }
}