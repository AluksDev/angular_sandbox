import { ChangeDetectionStrategy, Component, inject, OnInit, signal, effect, EventEmitter } from '@angular/core';
import { UsersListComponent } from '../../components/users-list-component/users-list-component';
import { UsersFiltersComponent } from "../../components/users-filters-component/users-filters-component";
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../../users.service';
import { DepartmentsService } from '@app/features/departments/departments.service';
import { finalize, map, Observable, of, Subject, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Department } from '@api/departments/DTOs/department.interface';
import { APIUser, User, UserTableRow } from '@api/users/DTOs/user.interace';
import { TableComponent } from "@app/shared/table-component/table-component";
import { TableActionConfig, TableColumnConfig } from '@app/shared/table-component/table.models';
import { mapApiUserToUser } from '@app/features/user/user.mapper';
import { GetUsersQuery } from '@api/shared/DTOs/api-get-users-query.interface';


type FilterValues = {
  searchTerm: string;
  department: string;
  status: string;
};

@Component({
  selector: 'app-users-list-page',
  imports: [UsersListComponent, UsersFiltersComponent, TableComponent],
  templateUrl: './users-list-page.html',
  styleUrl: './users-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListPage implements OnInit{
  usersService = inject(UsersService);
  departmentService = inject(DepartmentsService);

  totalUsers = signal<number>(0);
  usersList = signal<UserTableRow[]>([]);
  departmentList = signal<Department[]>([]);
  isLoading = signal<boolean>(false);
  query = signal<GetUsersQuery>({
    search: '',
    department: '',
    is_active: '',
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

  actionsSettings: TableActionConfig[] = [
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
    this.loadDepartments();
    this.loadUsers();
  }

  loadUsers(options?: GetUsersQuery) {
    console.log(options)
    this.isLoading.set(true);
    this.usersService.getAllUsers(options).pipe(
      finalize(() => this.isLoading.set(false)),
      tap((res)=> this.totalUsers.set(res.count)),
      map(res => {
          const deptMap = Object.fromEntries(
            this.departmentList().map(d => [d.id, d.name])
          );
        return res.results.map(u => {
          const user = mapApiUserToUser(u);
          return {
            ...user,
            initials: user.fullName.split(' ').map(name => name[0]).join('').toUpperCase(),
            departmentName: deptMap[user.department] ?? 'Unknown'
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
    console.log(event)
  }

  onSearchTermChange(searchTerm: string) {
  }

  onFilterChange(filters: FilterValues){
    const { searchTerm, department } = filters;
    let status = '';
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
    this.query.update(prev => ({
      ...prev,
      search: searchTerm,
      department: department,
      is_active: status
    }));

    this.loadUsers(this.query());
  }















  
  // Signals
  // departments$ = signal<Observable<Department[]>>(of([]));
  // departmentMap = signal<Record<number, string>>({});
  // userDataSource = signal(new MatTableDataSource<User>());
  // totalUsers = signal(0);
  
  // // State
  // private offset = signal(0);
  // private limit = signal(10);
  // private currentFilters = signal<FilterValues>({
  //   searchTerm: '',
  //   department: null,
  //   status: ''
  // });
  
  // private destroy = new Subject<void>();
  
  // ngOnInit() {
  //   this.departmentService.getDepartments().subscribe(deps => {
  //     this.departments$.set(of(deps));
  //     this.departmentMap.set(Object.fromEntries(deps.map(d => [d.id, d.name])));
  //   });
  // }
  
  // Called from filters component
  // onFilterChange(filters: FilterValues) {
  //   this.currentFilters.set(filters);
  //   this.offset.set(0);
  //   this.limit.set(10);
  //   this.loadUsers();
  // }
  
  // // Called from table component
  // onPageChange(event: PageEvent) {
  //   this.offset.set(event.pageIndex * event.pageSize);
  //   this.limit.set(event.pageSize);
  //   this.loadUsers();
  // }
  
  // // Called from table component
  // onSortChange(event: Sort) {
  //   this.loadUsers(event.active, event.direction);
  // }
  
  // private loadUsers(sortBy?: string, sortOrder?: string) {
  //   this.usersService.getUsers({
  //     ...this.currentFilters(),
  //     limit: this.limit(),
  //     offset: this.offset(),
  //     ...(sortBy && { sortBy, sortOrder })
  //   }).subscribe(results => {
  //     const dataSource = new MatTableDataSource(results.data);
  //     this.userDataSource.set(dataSource);
  //     this.totalUsers.set(results.total);
  //   });
  // }
}
