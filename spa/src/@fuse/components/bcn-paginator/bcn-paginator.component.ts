import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  input,
  OnDestroy,
  OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { ThemePalette } from '@angular/material/core';

/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class PageEvent {
  /** The current page index. */
  pageIndex: number;

  /** The index of the page that was selected previously. */
  previousPageIndex?: number;

  /** The current page size */
  pageSize: number;

  /** The current total number of items being paged */
  length: number;
}

// Boilerplate for applying mixins to MatPaginator.
class MatPaginatorBase {}

// const _MatPaginatorBase = mixinInitialized(MatPaginatorBase);

/**
 * Paginator Component for displaying a paginated view of data.
 */
@Component({
  selector: 'bcn-paginator',
  templateUrl: './bcn-paginator.component.html',
  styleUrls: ['./bcn-paginator.component.scss'],
  inputs: ['disabled'],
  host: {
    class: 'mat-paginator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatFormField,
    MatSelect,
    MatMenu,
    MatMenuTrigger,
    MatButton,
    MatIconButton,
    MatTooltip,
    MatOption,
    MatMenuModule,
  ],
})
export class BcnPaginatorComponent extends MatPaginatorBase implements OnInit, OnDestroy {
  _intl = inject(MatPaginatorIntl);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _initialized = false;
  private _intlChanges: Subscription;

  /** Theme color to be used for the underlying form controls. */
  color = input<ThemePalette>();

  /** The zero-based page index of the displayed list of items. Defaulted to 0. */
  @Input()
  get pageIndex(): number {
    return this._pageIndex;
  }

  set pageIndex(value: number) {
    this._pageIndex = Math.max(coerceNumberProperty(value), 0);
    this._changeDetectorRef.markForCheck();
  }

  private _pageIndex = 0;

  /** The length of the total number of items that are being paginated. Defaulted to 0. */
  @Input()
  get length(): number {
    return this._length;
  }

  set length(value: number) {
    this._length = coerceNumberProperty(value);
    this._changeDetectorRef.markForCheck();
  }

  private _length = 0;

  /** Number of items to display on a page. By default set to 50. */
  @Input()
  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    this._pageSize = Math.max(coerceNumberProperty(value), 0);
    this._updateDisplayedPageSizeOptions();
  }

  private _pageSize = DEFAULT_PAGE_SIZE;

  /** The set of provided page size options to display to the user. */
  @Input()
  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }

  set pageSizeOptions(value: number[]) {
    this._pageSizeOptions = (value || []).map((p) => coerceNumberProperty(p));
    this._updateDisplayedPageSizeOptions();
  }

  private _pageSizeOptions: number[] = [];

  /** Whether to hide the page size selection UI from the user. */
  @Input()
  get hidePageSize(): boolean {
    return this._hidePageSize;
  }

  set hidePageSize(value: boolean) {
    this._hidePageSize = coerceBooleanProperty(value);
  }

  private _hidePageSize = false;

  /** Whether to show the first/last buttons UI to the user. */
  @Input()
  get showFirstLastButtons(): boolean {
    return this._showFirstLastButtons;
  }

  set showFirstLastButtons(value: boolean) {
    this._showFirstLastButtons = coerceBooleanProperty(value);
  }

  private _showFirstLastButtons = true;

  /** Event emitted when the paginator changes the page size or page index. */
  readonly page = output<PageEvent>();

  /** Displayed set of page size options. Will be sorted and include current page size. */
  _displayedPageSizeOptions: number[];

  // Implementación de la propiedad `disabled` requerida por CanDisable
  private _disabled: boolean;

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  _markInitialized;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
    const _intl = this._intl;

    this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());
  }

  ngOnInit(): void {
    this._initialized = true;
    this._markInitialized = true; // Actualiza aquí si necesitas marcar como inicializado
    this._updateDisplayedPageSizeOptions();
  }

  ngOnDestroy(): void {
    this._intlChanges.unsubscribe();
  }

  /** Advances to the next page if it exists. */
  nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex++;
    this._emitPageEvent(previousPageIndex);
  }

  /** Move back to the previous page if it exists. */
  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex--;
    this._emitPageEvent(previousPageIndex);
  }

  /** Move to the first page if not already there. */
  firstPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = 0;
    this._emitPageEvent(previousPageIndex);
  }

  /** Move to the last page if not already there. */
  lastPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.getNumberOfPages() - 1;
    this._emitPageEvent(previousPageIndex);
  }

  /** Whether there is a previous page. */
  hasPreviousPage(): boolean {
    return this.pageIndex >= 1 && this.pageSize !== 0;
  }

  /** Whether there is a next page. */
  hasNextPage(): boolean {
    const maxPageIndex = this.getNumberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize !== 0;
  }

  /** Calculate the number of pages */
  getNumberOfPages(): number {
    if (!this.pageSize) {
      return 0;
    }

    return Math.ceil(this.length / this.pageSize);
  }

  getPageArray(): number[] {
    const initial = Array.from({ length: 1 }, (v, k) => k + 1);
    const middle = Array.from({ length: 11 }, (v, k) => this.pageIndex + k - 4);
    let result: number[] = [];
    result = result.concat(initial);
    result = result.concat(middle.filter((elem) => result.indexOf(elem) < 0));
    result = result.sort((a, b) => a - b);
    result = result.filter((elem) => elem > 0 && elem <= this.getNumberOfPages());
    return result;
  }

  goToPage(event: number): void {
    const previousPageIndex = this.pageIndex;
    this.pageIndex = event - 1;
    this._emitPageEvent(previousPageIndex);
  }

  /**
   * Changes the page size so that the first item displayed on the page will still be
   * displayed using the new page size.
   *
   * For example, if the page size is 10 and on the second page (items indexed 10-19) then
   * switching so that the page size is 5 will set the third page as the current page so
   * that the 10th item will still be displayed.
   */
  _changePageSize(pageSize: number): void {
    // Current page needs to be updated to reflect the new page size. Navigate to the page
    // containing the previous page's first item.
    const startIndex = this.pageIndex * this.pageSize;
    const previousPageIndex = this.pageIndex;

    this.pageIndex = Math.floor(startIndex / pageSize) || 0;
    this.pageSize = pageSize;
    this._emitPageEvent(previousPageIndex);
  }

  /** Changes the page size so that the first item on the page remains the same. */
  setPageSize(pageSize: number): void {
    this.pageSize = pageSize;
    const previousPageIndex = this.pageIndex;
    this.pageIndex = Math.floor((this.pageIndex * this.pageSize) / pageSize);
    this._emitPageEvent(previousPageIndex);
  }

  /** Checks whether the buttons for going forwards should be disabled. */
  _nextButtonsDisabled(): boolean {
    return this.disabled || !this.hasNextPage();
  }

  /** Checks whether the buttons for going backwards should be disabled. */
  _previousButtonsDisabled(): boolean {
    return this.disabled || !this.hasPreviousPage();
  }

  /** Updates the list of page size options displayed to the user. */
  private _updateDisplayedPageSizeOptions(): void {
    this._displayedPageSizeOptions = this.pageSizeOptions
      .concat(this.pageSize) // Include the current page size
      .filter((value, index, self) => self.indexOf(value) === index) // Ensure unique values
      .sort((a, b) => a - b); // Sort the values
  }

  /** Emits a page event. */
  private _emitPageEvent(previousPageIndex: number) {
    this.page.emit({
      pageIndex: this.pageIndex,
      previousPageIndex: previousPageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
  }
}
