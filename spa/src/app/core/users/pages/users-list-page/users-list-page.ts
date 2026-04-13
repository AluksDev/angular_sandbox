import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UsersListComponent } from '../../components/users-list-component/users-list-component';
import { UsersFiltersComponent } from "../../components/users-filters-component/users-filters-component";
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../../services/users.service';
import { DepartmentsService } from '@app/core/departments/departments.service';
import { Observable, of, Subject } from 'rxjs';
import { Department } from '@app/shared/interfaces/department.interface';
import { User } from '@app/shared/interfaces/user.interface';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';


type FilterValues = {
  searchTerm: string;
  department: number | null;
  status: string;
};

@Component({
  selector: 'app-users-list-page',
  imports: [UsersListComponent, UsersFiltersComponent],
  templateUrl: './users-list-page.html',
  styleUrl: './users-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListPage {
  usersService = inject(UsersService);
  departmentService = inject(DepartmentsService);
  
  // Signals
  departments$ = signal<Observable<Department[]>>(of([]));
  departmentMap = signal<Record<number, string>>({});
  userDataSource = signal(new MatTableDataSource<User>());
  totalUsers = signal(0);
  
  // State
  private offset = signal(0);
  private limit = signal(10);
  private currentFilters = signal<FilterValues>({
    searchTerm: '',
    department: null,
    status: ''
  });
  
  private destroy = new Subject<void>();
  
  ngOnInit() {
    this.departmentService.getDepartments().subscribe(deps => {
      this.departments$.set(of(deps));
      this.departmentMap.set(Object.fromEntries(deps.map(d => [d.id, d.name])));
    });
  }
  
  // Called from filters component
  onFilterChange(filters: FilterValues) {
    this.currentFilters.set(filters);
    this.offset.set(0);
    this.limit.set(10);
    this.loadUsers();
  }
  
  // Called from table component
  onPageChange(event: PageEvent) {
    this.offset.set(event.pageIndex * event.pageSize);
    this.limit.set(event.pageSize);
    this.loadUsers();
  }
  
  // Called from table component
  onSortChange(event: Sort) {
    this.loadUsers(event.active, event.direction);
  }
  
  private loadUsers(sortBy?: string, sortOrder?: string) {
    this.usersService.getUsers({
      ...this.currentFilters(),
      limit: this.limit(),
      offset: this.offset(),
      ...(sortBy && { sortBy, sortOrder })
    }).subscribe(results => {
      const dataSource = new MatTableDataSource(results.data);
      this.userDataSource.set(dataSource);
      this.totalUsers.set(results.total);
    });
  }
}
