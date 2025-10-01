import { DataSource } from '@angular/cdk/collections';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';

export interface ServiceForm<DataModel> {
  form: FormGroup;

  // submit(): Observable<DataModel>;
  submit(value?: any, cache?: boolean, onlyCache?: boolean): Observable<DataModel>;

  reset(value?: any): void;

  cancelPreviousRequest(): void;
}

export interface DataModelResult<Element> {
  count: number;
  results: Element[];
}

export class NasiaDataSource<
  Element,
  DataModel extends DataModelResult<Element>,
  Service extends ServiceForm<DataModel>,
> implements DataSource<Element>
{
  private listSubject = new BehaviorSubject<Element[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  private _paginator: MatPaginator | null;
  formServiceSub: Subscription;

  public loading$ = this.loadingSubject.asObservable(); // Expose loading as an observable
  public count$ = this.countSubject.asObservable(); // Expose count as an observable
  public elements$ = this.listSubject.asObservable();

  public elementsInterceptor: (result: Observable<DataModel>) => Observable<DataModel>;

  constructor(public formService: Service) {
    this.elementsInterceptor = (result): Observable<DataModel> => result;
  }

  /**
   * Load a list of attributes from the server
   * The limit and offset is calculated from the paginator current page
   */
  loadList(): void {
    this.loadingSubject.next(true); // Set loading true

    // Cancel previous request
    this.formService.cancelPreviousRequest();

    if (this._paginator) {
      this.formService.form.patchValue({
        limit: this._paginator.pageSize,
        offset: this._paginator.pageIndex * this._paginator.pageSize,
      });
    }

    this.formServiceSub = this.elementsInterceptor(this.formService.submit())
      .pipe(
        map((entities) => {
          this.listSubject.next(entities.results); // Set the attributes
          this.countSubject.next(entities.count); // Set the count
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)), // Set loading to false
      )
      .subscribe();
  }

  /**
   * Check if the current page is empty and reload the page
   */
  loadAfterElementRemoved(): void {
    // Check if we run out of elements in the current page
    if (this._paginator) {
      const currentPageStart = this._paginator.pageIndex * this._paginator.pageSize;

      if (currentPageStart >= this.countSubject.value - 1 && this._paginator.pageIndex > 0) {
        this._paginator.previousPage(); // Will emit a page event where loadAttribute is invoked
      } else {
        this.loadList();
      }
    }
  }

  /**
   * Set paginator and subscribe to page changes
   * Remember to call this method once the paginator is initialized
   */
  set paginator(paginator: MatPaginator | null) {
    if (paginator) {
      this._paginator = paginator;

      // Reload elements when we change pages
      this._paginator.page.subscribe(() => {
        this.loadList();
      });
    }
  }

  /**
   * Used by the MatTable. Called when it connects to the data source.
   */
  connect(): Observable<Element[]> {
    return this.listSubject.asObservable();
  }

  /**
   * Used by the MatTable. Called when it is destroyed.
   */
  disconnect(): void {}
}
