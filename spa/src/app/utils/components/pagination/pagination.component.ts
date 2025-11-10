import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';


/**
 * Component that provides pagination controls and navigates through paginated data.
 *
 * Responsibilities:
 * - Displays pagination buttons: previous and next page indicator
 * - Syncs the current page with the `page` query parameter in the URL
 * 
 * Usage:
 * - Place this component below paginated content (e.g., table or card list)
 * - It relies on Angular Router to manage pagination state via query params
 */
@Component({
  selector: 'pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent { 

  private router = inject(Router);

  currentPage = input<number>(1);
  pages = input<number>(0);

  activatePage = linkedSignal(this.currentPage);

  increase(number: number){
    this.activatePage.update(value => value + number);
    this.navigate(this.activatePage());
    
  }


  navigate(page: number){
    this.router.navigate(['list-users'], {
      queryParams: {page: page}
    } )
  }

}
