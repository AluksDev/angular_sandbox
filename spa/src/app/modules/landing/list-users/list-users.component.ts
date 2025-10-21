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


const LIMIT = 10;


@Component({
  selector: 'app-list-users',
  imports: [PaginationComponent, RouterLink, MatProgressSpinnerModule, ReactiveFormsModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUsersComponent implements OnInit {
  
  
  usersService = inject(UserService);
  paginationService = inject(PaginationService);
  
  usersResource = rxResource({
    request: () => ({ 
      page: this.paginationService.currentPage() - 1,
      search: this.searchQuery(),
      onlyActives: this.onlyActives()

    }),
    loader: ({request}) => {
      
      if(request.onlyActives){
        return this.usersService.getUsers({
        offset: request.page * LIMIT,
        search: request.search,
        is_active: true,
      });  
      }

      return this.usersService.getUsers({
        offset: request.page * LIMIT,
        search: request.search
      });
    }
  });
  
  searchInputControl = new FormControl('');

  totalPages = Math.ceil(this.usersResource.value()?.count / LIMIT);
  searchQuery = signal('');
  onlyActives = signal(false);
  
  ngOnInit() {
    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300),
      )
      .subscribe(value => {
        this.searchQuery.set(value)
      });
  }
  
  toggleOnlyActiveValue() {
    this.onlyActives.update( value => !value );
  } 

}
