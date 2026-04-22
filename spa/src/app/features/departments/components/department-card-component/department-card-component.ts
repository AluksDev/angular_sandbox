import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Department } from '@api/departments/DTOs/department.interface';

@Component({
  selector: 'app-department-card-component',
  imports: [MatIconModule],
  templateUrl: './department-card-component.html',
  styleUrl: './department-card-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentCardComponent { 
  department = input<Department>();
  action = output<{dep: Department, action: string}>();

  onActionClick(action: string) {
    this.action.emit({
      dep: this.department(),
      action: action
    });
  }
}
