import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Department } from '@api/departments/DTOs/department.interface';
import { BreadcrumbComponent } from "@app/shared/components/breadcrumb-component/breadcrumb-component";
import { ICONS } from '@app/shared/ui/icon/icons';
import { MatIconModule } from "@angular/material/icon";
import { TableComponent } from "@app/shared/table-component/table-component";
import { UsersService } from '@app/services/users.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@api/users/DTOs/user.interace';
import { mapApiUserToUser } from '@app/features/user/user.mapper';
import { TableColumnConfig } from '@app/shared/table-component/table.models';
import { PageEvent } from '@angular/material/paginator';
import { GetQuery } from '@api/shared/DTOs/api-get-users-query.interface';
import { finalize } from 'rxjs';

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
  router = inject(Router);
  
  icons = ICONS.departments;
  departmentDetails = signal<Department>(null);
  users = signal<User[]>([]);
  totalUsers = signal<number>(0);
  loadingUsers = signal<boolean>(false);
  query = signal<GetQuery>({
    limit: 10,
    offset: 0,
  })

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
      this.query.update(prev => ({
        ...prev,
        department: String(departmentId)
      }))
      this.loadUsers(this.query());
    }
  }

  loadUsers(options?: GetQuery) {
    this.loadingUsers.set(true);
    this.usersService.getAllUsers(options).pipe(
      finalize(() => this.loadingUsers.set(false))
    )
    .subscribe({
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

  onPageChange(event: PageEvent) {
    const offset = event.pageIndex * event.pageSize;

    this.query.update(prev => ({
      ...prev,
      limit: event.pageSize,
      offset
    }));

    this.loadUsers(this.query());
  }
  OnRowClick(user: User) {
    this.router.navigate(['/users', user.id]);
  }
}
