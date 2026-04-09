import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { debounceTime, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { FormSelectComponent } from '@app/shared/forms/components/form-select-component/form-select-component';
import { Department } from '@app/shared/interfaces/department.interface';
import { DepartmentsService } from '@app/core/departments/departments.service';

@Component({
  selector: 'app-users-list-component',
  imports: [MatTableModule, NgClass, FormInputComponent, ReactiveFormsModule, FormSelectComponent, AsyncPipe],
  templateUrl: './users-list-component.html',
  styleUrl: './users-list-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = [
    'avatar',
    'fullName',
    'username',
    'email',
    'department',
    'status',
    'actions'
  ];  
  userDataSource = new MatTableDataSource([]);
  departments$: Observable<Department[]>;
  departmentsNames: string[];

  fb = inject(FormBuilder);
  usersForm = this.fb.group({
    searchTerm: [''],
    department: [null as number | null],
    status: [''],
    limit: [10],
    offset: 0
  })

  private destroy = new Subject<void>();

  usersService = inject(UsersService);
  departmentService = inject(DepartmentsService);

  ngOnInit() {
    this.departments$ = this.departmentService.getDepartments();
    this.usersForm.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((options)=> this.usersService.getUsers(options)),
      takeUntil(this.destroy)
    )
    .subscribe(results => {
      this.userDataSource.data = results;
    })
  }

  getInitials(fullName: string): string{
    const initials = fullName.split(' ').map((name) => name[0]);
    return initials.join('');
  }
 }
