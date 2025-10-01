import { Component, effect, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule, NgClass } from '@angular/common';

import { BcnPaginatorComponent } from '../bcn-paginator/bcn-paginator.component';
import { NoResultsComponent } from '../no-results/no-results.component';
import { FakeLoadingComponent } from '../fake-loading/fake-loading.component';

@Component({
  selector: 'app-paginated-table',
  templateUrl: './paginated-table.component.html',

  imports: [MatProgressSpinner, NgClass, BcnPaginatorComponent, NoResultsComponent, FakeLoadingComponent, CommonModule],
  styleUrls: ['./paginated-table.component.scss'],
})
export class PaginatedTableComponent implements OnInit {
  private router = inject(Router);
  protected route = inject(ActivatedRoute);

  readonly topPaginator = viewChild<MatPaginator>('topPaginator');
  readonly bottomPaginator = viewChild<MatPaginator>('bottomPaginator');
  readonly topPage = viewChild<ElementRef>('topPage');

  pageSizeOptions = input([10, 20, 50, 100]);
  paginatorConfigInput = input('both'); // both, bottom, top, none
  paginatorConfig = signal('both'); // both, bottom, top, none
  styleConfig = input('big'); // // big, medium or small
  resultsCount = input(0);
  loading = input(false);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    effect(() => {
      const paginatorConfigLocal = this.paginatorConfigInput();
      this.paginatorConfig.set(paginatorConfigLocal);
    });
  }

  ngOnInit(): void {
    if (this.styleConfig() === 'small' || this.styleConfig() === 'medium') {
      this.paginatorConfig.set('bottom');
    }
  }

  scrollToTop(): void {
    this.topPage().nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  syncPaginators(event: PageEvent): void {
    const topPaginator = this.topPaginator();
    if (topPaginator && (topPaginator.pageSize !== event.pageSize || topPaginator.pageIndex !== event.pageIndex)) {
      // Changes in bottom Paginator
      topPaginator.pageSize = event.pageSize;
      topPaginator.pageIndex = event.pageIndex;
      // The bottom paginator is not connected with the dataSource
      // so we need to emit the event to actually change the page
      topPaginator.page.emit(event);
    } else {
      // Changes in top paginator
      const bottomPaginator = this.bottomPaginator();
      if (bottomPaginator) {
        bottomPaginator.pageSize = event.pageSize;
        bottomPaginator.pageIndex = event.pageIndex;
      }
    }
    this.scrollToTop();
  }
}
