import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Department } from '@api/departments/DTOs/department.interface';
import { BreadcrumbComponent } from "@app/shared/components/breadcrumb-component/breadcrumb-component";
import { ICONS } from '@app/shared/ui/icon/icons';
import { MatIconModule } from "@angular/material/icon";
import { TableComponent } from "@app/shared/table-component/table-component";
import { UsersService } from '@app/features/users/users.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@api/users/DTOs/user.interace';
import { mapApiUserToUser } from '@app/features/user/user.mapper';
import { TableColumnConfig } from '@app/shared/table-component/table.models';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-department-details-page',
  imports: [BreadcrumbComponent, RouterLink, MatIconModule, TableComponent],
  templateUrl: './department-details-page.html',
  styleUrl: './department-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentDetailsPage implements OnInit{ 
  route = inject(ActivatedRoute);
  usersService = inject(UsersService);
  
  icons = ICONS.departments;
  departmentDetails = signal<Department>(null);
  users = signal<User[]>([]);
  totalUsers = signal<number>(0);

  usersListConfig: TableColumnConfig[] = [
    {
      key: 'fullName',
      label: 'Name'
    },
    {
      key: 'username',
      label: 'Username'
    }
  ]
  
  ngOnInit(): void {
    this.departmentDetails.set(this.route.snapshot.data['departmentDetails']);

    const departmentId = this.departmentDetails()?.id;

    if (departmentId) {
      this.usersService.getAllUsers({department: String(departmentId)}).subscribe({
        next: (res => {
          if (!res) return;
          this.totalUsers.set(res.count);
          if (res.results){
            const users = res.results.map(u => {
              return mapApiUserToUser(u);
            })
            this.users.set(users);
          }
        }),
        error: (err => {
          console.error(err);
        })
      })
    }
  }

  onPageChange(event: PageEvent) {
    console.log(event)
  }
  OnRowClick(event: User) {
    console.log(event)
  }
}
