import { AsyncPipe, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { debounceTime, Observable, of, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { FormSelectComponent } from '@app/shared/forms/components/form-select-component/form-select-component';
import { DepartmentsService } from '@app/core/departments/departments.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {  MatSortModule, Sort } from '@angular/material/sort';
import {MatChipsModule} from '@angular/material/chips';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@api/users/DTOs/user.interace';

@Component({
  selector: 'app-users-list-component',
  imports: [MatTableModule, NgClass, ReactiveFormsModule, MatPaginatorModule, MatSortModule, MatChipsModule],
  templateUrl: './users-list-component.html',
  styleUrl: './users-list-component.scss',
})
export class UsersListComponent {
   displayedColumns = [
    'avatar',
    'fullName',
    'username',
    'email',
    'department',
    'status',
    'actions'
  ];
  dataSource = input.required<MatTableDataSource<User>>();
  totalUsers = input.required<number>();
  departmentMap = input.required<Record<number, string>>();

  pageChange = output<PageEvent>();
  sortChange = output<Sort>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  getInitials(fullName: string): string {
    return fullName.split(' ').map(n => n[0]).join('');
  }
  
  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
  
  onSortChange(event: Sort) {
    this.sortChange.emit(event);
  }

  // userDataSource!: MatTableDataSource<User>;
  // departments$: Observable<Department[]>;
  // departmentMap: Record<number, string> = {};

  // fb = inject(FormBuilder);
  // usersForm = this.fb.group({
  //   searchTerm: [''],
  //   department: [null as number | null],
  //   status: [''],
  // })

  // formValue = toSignal(this.usersForm.valueChanges, {
  //   initialValue: this.usersForm.value
  // });
  
  // activeFilters = computed(() => {
  //   const { searchTerm, status, department } = this.formValue();

  //   return [
  //     searchTerm && { label: `Search: ${searchTerm}`, key: 'searchTerm' },
  //     status && { label: `Status: ${status}`, key: 'status' },
  //     department && { label: `Department: ${this.departmentMap[department]}`, key: 'department' }
  //   ].filter(Boolean);
  // });

  // private destroy = new Subject<void>();

  // usersService = inject(UsersService);
  // departmentService = inject(DepartmentsService);
  // totalUsers: number = 0;
  // offset: number = 0;
  // limit: number = 10;
  // ngOnInit() {
  //   this.userDataSource = new MatTableDataSource<User>();

  //   this.departmentService.getDepartments().subscribe(deps => {
  //     this.departments$ = of(deps);
  //     this.departmentMap = Object.fromEntries(
  //       deps.map(d => [d.id, d.name])
  //     )
  //   });

  //   this.usersForm.valueChanges
  //   .pipe(
  //     tap(() => {
  //         this.offset = 0;
  //         this.limit = 10;
  //         if (this.paginator) {
  //           this.paginator.pageIndex = 0; 
  //         }
  //       }),
  //     debounceTime(300),
  //     startWith(this.usersForm.value), 
  //     switchMap((options)=> this.usersService.getUsers({...options, limit: this.limit, offset: this.offset})),
  //     takeUntil(this.destroy)
  //   )
  //   .subscribe(results => {
  //     this.userDataSource.data = results.data;
  //     this.totalUsers = results.total;
  //   })
  // }

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  // getInitials(fullName: string): string{
  //   const initials = fullName.split(' ').map((name) => name[0]);
  //   return initials.join('');
  // }

  // onPageChange(event: PageEvent) {
  //   this.offset = event.pageIndex * event.pageSize;
  //   this.limit = event.pageSize;
  //   this.usersService.getUsers({ 
  //     ...this.usersForm.value, 
  //     limit: this.limit, 
  //     offset: this.offset 
  //   }).subscribe(results => {
  //     this.userDataSource.data = results.data;
  //     this.totalUsers = results.total;
  //   })
  // }
  // sortColumn(event: Sort){
  //   this.usersService.getUsers({
  //     ...this.usersForm.value,
  //     limit: this.limit,
  //     offset: this.offset,
  //     sortBy: event.active,
  //     sortOrder: event.direction
  //   }).subscribe(results => {
  //     this.userDataSource.data = results.data;
  //     this.totalUsers = results.total;
  //   })
  // }

  // removeFilter(filter: string){
  //    if (filter === 'status') {
  //     this.usersForm.patchValue({ status: '' });
  //   } else if (filter === 'department') {
  //     this.usersForm.patchValue({ department: null });
  //   } else if (filter === 'searchTerm') {
  //     this.usersForm.patchValue({ searchTerm: '' });
  //   }
  // }
 }
