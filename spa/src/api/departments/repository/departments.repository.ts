import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiPaginatedResponse } from "@api/shared/DTOs/api-paginated-response.interface";
import { Observable } from "rxjs";
import { CreateDepartment, Department } from "../DTOs/department.interface";

@Injectable({
  providedIn: "root",
})
export class DepartmentsRepository {
  private http = inject(HttpClient);

  getDepartments(): Observable<ApiPaginatedResponse<Department>> {
    return this.http.get<ApiPaginatedResponse<Department>>(
      "/services/sandbox/department/",
    );
  }
  addDepartment(newDep: CreateDepartment): Observable<Department>{
    return this.http.post<Department>("/services/sandbox/department/", newDep)
  }

  deleteDepartmentById(id: number): Observable<void> {
    return this.http.delete<void>(`/services/sandbox/department/${id}/`);
  }

  updateDepartment(dep: Department): Observable<Department>{
    const { id, name, code } = dep;
    const body: any = { name };
    if (code){
      body.code = code;
    }
    return this.http.patch<Department>(`/services/sandbox/department/${id}/`, body)
  }
}