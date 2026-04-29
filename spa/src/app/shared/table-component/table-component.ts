import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TableActionConfig, TableColumnConfig } from './table.models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormInputComponent } from "../forms/components/form-input-component/form-input-component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { AvatarComponent } from "@app/features/user/components/avatar-component/avatar-component";
import { FormSelectComponent } from "../forms/components/form-select-component/form-select-component";
import { MatLabel, MatSelect, MatFormField, MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-table-component',
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, NgClass, MatProgressSpinnerModule, FormInputComponent, ReactiveFormsModule, AvatarComponent, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './table-component.html',
  styleUrl: './table-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent <T> implements OnInit{ 
  dataSource = input<T[]>();
  columns = input<TableColumnConfig[]>();
  actions = input<TableActionConfig[]>();
  totalElements = input<number>();
  emptyMessage = input<string>('No data');
  clickableRow = input<boolean>(false);
  loading = input<boolean>(false);
  searchable = input<boolean>();

  columnsNames = computed(() => {
    const cols = this.columns()?.map(c => c.key) ?? [];

    return this.actions()?.length
      ? [...cols, 'actions']
      : cols;
  });

  pageChange = output<PageEvent>();
  sortChange = output<Sort>();
  executeAction = output<{action: string, element: T}>();
  rowClick = output<T>();
  searchTerm = output<string>()
  fb = inject(FormBuilder);
  searchForm = this.fb.group({
    searchTerm: ['']
  })

  private destroy$ = new Subject<void>();
  ngOnInit() {
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
      )
      .subscribe(value => {
        this.searchTerm.emit(value.searchTerm ?? '');
      });
    }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  resetPagination() {
    this.paginator.firstPage();
  }
  
  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
  
  onSortChange(event: Sort) {
    this.sortChange.emit(event);
  }

  onActionClick(action: string, element: T){
    this.executeAction.emit({action, element});
  }
  onRowClick(row: T){
    if (!this.clickableRow()) return;
    this.rowClick.emit(row);
  }
}
