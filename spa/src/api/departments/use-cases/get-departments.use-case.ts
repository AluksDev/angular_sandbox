import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DepartmentsRepository } from "../repository/departments.repository";
import { ApiPaginatedResponse } from "@api/shared/DTOs/api-paginated-response.interface";
import { Department } from "../DTOs/department.interface";

@Injectable({
  providedIn: "root",
})
export class GetDepartmentsUseCase {
  private departmentsRepository = inject(DepartmentsRepository);

  execute(search?: string): Observable<ApiPaginatedResponse<Department>> {
    return this.departmentsRepository.getDepartments(search);
  }
}