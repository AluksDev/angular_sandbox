import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Department } from '@api/departments/DTOs/department.interface';
import { APIUser } from '@api/users/DTOs/user.interace';
import { ICONS } from '@app/shared/ui/icon/icons';

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
  icons = ICONS.departments;
  currentUser = input<APIUser>();

  onActionClick(action: string, event: MouseEvent) {
    event.stopPropagation();
    this.action.emit({
      dep: this.department(),
      action: action
    });
  }
}
