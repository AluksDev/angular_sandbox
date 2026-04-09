import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { debounceTime, Subject, switchMap, takeUntil } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { FormSelectComponent } from '@app/shared/forms/components/form-select-component/form-select-component';

@Component({
  selector: 'app-users-list-component',
  imports: [MatTableModule, NgClass, FormInputComponent, ReactiveFormsModule, FormSelectComponent],
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
  dataSource = new MatTableDataSource([]);

  fb = inject(FormBuilder);
  usersForm = this.fb.group({
    searchTerm: [''],
    department: [''],
    status: ['']
  })

  searchResult = new Subject<any>();
  private destroy = new Subject<void>();
  usersService = inject(UsersService);

  ngOnInit() {
    this.usersForm.controls['searchTerm']?.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((searchTerm)=> this.usersService.getUsers({ searchTerm })),
      takeUntil(this.destroy)
    )
    .subscribe(results => {
      this.dataSource.data = results;
    })
  }

  getInitials(fullName: string): string{
    const initials = fullName.split(' ').map((name) => name[0]);
    return initials.join('');
  }

  searchTimer:any;
  searchUser(value: string) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(()=>{
      this.dataSource.filter = value.trim().toLowerCase();
    }, 300)
  }
 }
