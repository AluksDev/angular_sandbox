import { Component, inject, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DepartmentService } from '@modules/departments/department.service';
import { map } from 'rxjs';

export type UserStatus = 'todos' | 'active' | 'inactive';

interface State {
  value: UserStatus;
  viewValue: string;
}


@Component({
  selector: 'users-filters',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './users-filters.component.html',
  styleUrl: './users-filters.component.css'
})
export class UsersFiltersComponent { 

  departmentService = inject(DepartmentService);

  defaultDepartment = {
    id: 0,
    name: 'Ninguno',
    code: null
  };

  departmentResource = rxResource({
    loader: ({}) => {
      return this.departmentService.getDepartments('')
      .pipe(
        map(departments => {
          return [this.defaultDepartment, ...departments.results]; 
        })
      );
    }
  });


  states: State[] = [
    {value: 'todos', viewValue: 'Todos'},
    {value: 'active', viewValue: 'Activos'},
    {value: 'inactive', viewValue: 'Inactivos'},
  ];

  defaultStateValue: string = 'todos';

  defaultDepartmentValue: number = 0;

  statusFilterChanged = output<string>();
  departmentFilterChanged = output<number>();

  onStatusChange(newValue: string): void {
      this.statusFilterChanged.emit(newValue);
  }

  onDepartmentChange(newValue: number): void {
    this.departmentFilterChanged.emit(newValue);
  }

}
