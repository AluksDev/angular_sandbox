import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '@app/services/user.service';
import { UserSearchPipe } from '@utils/pipe/user.search.pipe';
import { PaginationComponent } from "@utils/components/pagination/pagination.component";
import { RouterLink } from "@angular/router";
import { PaginationService } from '@utils/services/pagination.service';
import { OnlyActivePipe } from '@utils/pipe/user.active.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


const LIMIT = 10;


@Component({
  selector: 'app-list-users',
  imports: [UserSearchPipe, OnlyActivePipe, PaginationComponent, RouterLink, MatProgressSpinnerModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUsersComponent {
  
  
  usersService = inject(UserService);
  paginationService = inject(PaginationService);
  
  usersResource = rxResource({
    request: () => ({ page: this.paginationService.currentPage() - 1 }),
    loader: ({request}) => {
      
      return this.usersService.getUsers({
        offset: request.page * LIMIT
      });
    }
  });
  
  totalPages = Math.ceil(this.usersResource.value()?.count / LIMIT);
  searchQuery = signal('');
  onlyActives = signal(false);
  
  
  toggleOnlyActiveValue() {
    this.onlyActives.update( value => !value );
  } 

}
