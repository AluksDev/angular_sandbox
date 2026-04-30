import { ChangeDetectionStrategy, Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { UsersFiltersComponent } from "../../components/users-filters-component/users-filters-component";
import { UsersService } from '../../users.service';
import { DepartmentsService } from '@app/features/departments/departments.service';
import { finalize, map, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Department } from '@api/departments/DTOs/department.interface';
import { TableComponent } from "@app/shared/table-component/table-component";
import { TableActionConfig, TableColumnConfig } from '@app/shared/table-component/table.models';
import { mapApiUserToUser } from '@app/features/user/user.mapper';
import { GetQuery } from '@api/shared/DTOs/api-get-users-query.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@api/users/DTOs/user.interace';


type FilterValues = {
  search: string;
  department: string;
  status: string;
};

@Component({
  selector: 'app-users-list-page',
  imports: [UsersFiltersComponent, TableComponent, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './users-list-page.html',
  styleUrl: './users-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListPage implements OnInit{
  usersService = inject(UsersService);
  departmentService = inject(DepartmentsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  destroyRef = inject(DestroyRef);

  totalUsers = signal<number>(0);
  usersList = signal<User[]>([]);
  departmentList = signal<Department[]>([]);
  isLoading = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  query = signal<GetQuery>({
    limit: 10,
    offset: 0,
  })

  columnsSettings: TableColumnConfig[] = [
    {
      key: 'initials',
      label: '',
      sortable: false
    },
    {
      key: 'fullName',
      label: 'Full Name',
      sortable: true
    },
    {
      key: 'username',
      label: 'Username',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'departmentName',
      label: 'Department',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      is_badge: true
    },
  ]

  userActionsSettings: TableActionConfig[] = [
    {
      key: 'details',
      label: 'Details',
      color: 'success'
    },
  ]

  adminActionsSettings: TableActionConfig[] = [
    {
      key: 'details',
      label: 'Details',
      color: 'success'
    },
    {
      key: 'edit',
      label: 'Edit',
      color: 'warn'
    },
    {
      key: 'deactivate',
      label: 'Deactivate',
      color: 'danger'
    },
  ]

  ngOnInit() {
    this.authService.currentUser$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(user => {
      if (!user) return;
      if (user.roles.includes('admin') || user.roles.includes('superuser')){
        this.isAdmin.set(true);
      } else {
        this.isAdmin.set(false);
      }
    });
    
    this.loadDepartments();
    this.route.queryParams.subscribe(params => {
      const initialQuery: GetQuery = {
        limit: this.query().limit,
        offset: this.query().offset,
        department: params['department'] ?? undefined,
        is_active: params['status'] ?? undefined,
        search: params['search'] ?? undefined
      }
      this.query.set(initialQuery);
      this.loadUsers(initialQuery);
    })
  }

  loadUsers(options?: GetQuery) {
    this.isLoading.set(true);
    this.usersService.getAllUsers(options).pipe(
      finalize(() => this.isLoading.set(false)),
      tap((res)=> this.totalUsers.set(res.count)),
      map(res => {
        return res.results.map(u => {
          const user = mapApiUserToUser(u);
          return {
            ...user,
            initials: user.fullName.split(' ').map(name => name[0]).join('').toUpperCase(),
          }
        });
      })
    )
    .subscribe( users => {
      this.usersList.set(users);
    })
  }

  loadDepartments(){
  this.departmentService.getDepartments().pipe(
      tap(res => this.departmentList.set(res.results))
    ).subscribe();
  }
  
  onPaginationChange(event: PageEvent) {    
    const offset = event.pageIndex * event.pageSize;

    this.query.update(prev => ({
      ...prev,
      limit: event.pageSize,
      offset
    }));

    this.loadUsers(this.query());
  }

  onSortChange(event: Sort){
    let sortField = event.active;
    switch (sortField) {
      case 'fullName':
        sortField = 'first_name'
        break;
      case 'status':
        sortField = 'is_active';
        break;
      case 'departmentName':
        sortField = 'department';
        break;
      }
    const direction = event.direction;
    this.query.update(prev => ({
      ...prev,
      ordering: direction
        ? (direction === 'asc' ? sortField : `-${sortField}`)
        : undefined
    }))
    this.loadUsers(this.query());
  }

  onFilterChange(filters: FilterValues){
    this.resetTable();
    let { search, department, status } = filters;
    switch (filters.status) {
      case 'active':{
        status = 'true'
        break;
      }
      case 'inactive':{
        status = 'false'
        break;
      }
      default: 
        status = '';
        break;
    }
    const queryParams: any = {};
    if (search?.trim()) queryParams.search = search;
    if (department) queryParams.department = department;
    if (status) queryParams.status = status;
    this.router.navigate([], {
      queryParams,
    });
  }

  onAction(event: {action: string, element: User}){
    const { action, element } = event;
    const userId = element.id;
    switch (action){
      case 'details':
        this.router.navigate(['/users', userId])
        break;
      case 'edit':
        this.router.navigate(['/users', userId, 'edit']);
        break;
    }
  }
  @ViewChild(TableComponent) table!: TableComponent<UserTableRow[]>;

  resetTable() {
    this.table.resetPagination();
  }
}
