import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '@app/services/user.service';
import { PaginationComponent } from "@utils/components/pagination/pagination.component";
import { RouterLink } from "@angular/router";
import { PaginationService } from '@utils/services/pagination.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { SortByLoginPipe } from '@utils/pipe/login-sort.pipe';
import { MatIconModule } from '@angular/material/icon';
import { UsersFiltersComponent, UserStatus } from "./components/users-filters.component/users-filters.component";
import { UserRowActionsComponent } from "./components/user-row-actions.component/user-row-actions.component";

/**
 * User limit in a page
 */
const LIMIT = 10;
registerLocaleData(localeEs, 'es'); // Registra el locale 'es'

@Component({
  selector: 'app-list-users',
  imports: [
    PaginationComponent,
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    SortByLoginPipe,
    UsersFiltersComponent,
    UserRowActionsComponent
],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUsersComponent implements OnInit {
  
  
  usersService = inject(UserService);
  paginationService = inject(PaginationService);
  
  /**
   * Reactive resource that fetches a paginated list of users from the API.
   *
   * - Automatically reacts to changes in:
   *   - Current page (from `paginationService`)
   *   - Search query (`searchQuery()`)
   *   - "Only actives" toggle (`onlyActives()`)
   *
   * - Request parameters:
   *   - `page`: page index used for calculating the offset
   *   - `search`: Optional search string to filter users
   *   - `onlyActives`: Boolean flag to fetch only active users if true
   *
   * - Loader behavior:
   *   - Fetches users with `offset` based on current page and a fixed `LIMIT`
   *   - Includes `is_active: true` when `onlyActives` is enabled
   *
   * - This resource can be used to reactively bind to UI elements such as
   *   pagination controls, search bars, and active filters.
   */
  usersResource = rxResource({
    request: () => ({ 
      page: this.paginationService.currentPage() - 1,
      search: this.searchQuery(),
      statusFilter: this.currentStatusFilter(),
      departmentFilter: this.currentDepartmentFilter()

    }),
    loader: ({request}) => {
        
      const params: { [key: string]: any } = {
        offset: request.page * LIMIT,
      };

      if (request.search) {
        params['search'] = request.search;
      }

      
      if (request.statusFilter === 'active') {
        params['is_active'] = true;
      } else if (request.statusFilter === 'inactive') {
        params['is_active'] = false;
      }

      if (request.departmentFilter !== 0) {
        params['department'] = request.departmentFilter;
      }
      
      return this.usersService.getUsers(params);
    }
  });
  
  searchInputControl = new FormControl('');

  totalPages = Math.ceil(this.usersResource.value()?.count / LIMIT);
  searchQuery = signal('');
  lastLogin = signal(false);
  currentStatusFilter = signal<UserStatus>('todos');
  currentDepartmentFilter = signal<number>(0);
  
  ngOnInit() {
     /**
     * Subscribes to search input changes with a 300ms debounce.
     * Updates the reactive search query used by the usersResource.
     * 
     * - Avoids duplicate emissions via `distinctUntilChanged`
     */
    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300),
      )
      .subscribe(value => {
        this.searchQuery.set(value)
      });
  }

  toggleLastLoginValue() {
    this.lastLogin.update( value => !value );
  } 

  handleFilterChange(newStatus: UserStatus): void {
    this.currentStatusFilter .set(newStatus);
  }

  handleDepartmentChange(newId: number): void {
    this.currentDepartmentFilter.set(newId);
  }

}
