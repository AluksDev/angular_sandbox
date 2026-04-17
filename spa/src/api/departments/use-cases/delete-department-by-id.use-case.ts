import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DepartmentsRepository } from "../repository/departments.repository";

@Injectable({
  providedIn: "root",
})
export class DeleteDepartmentByIdUseCase {
  private departmentsRepository = inject(DepartmentsRepository);

  execute(id: number): Observable<void> {
    return this.departmentsRepository.deleteDepartmentById(id);
  }
}