import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DepartmentsService } from '../../departments.service';
import {  Department } from '@api/departments/DTOs/department.interface';
import { DepartmentCardComponent } from '../../components/department-card-component/department-card-component';
import { MatDialog } from '@angular/material/dialog';
import { NewDepartmentDialog } from '../../components/new-department-dialog/new-department-dialog';
import { DeleteDepartmentDialog } from '../../components/delete-department-dialog/delete-department-dialog';
import { EditDepartmentDialog } from '../../components/edit-department-dialog/edit-department-dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, finalize } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { NotificationsService } from '@app/core/notifications/notification.service';

@Component({
  selector: 'app-departments-page',
  imports: [DepartmentCardComponent, MatButtonModule, FormInputComponent, ReactiveFormsModule],
  templateUrl: './departments-page.html',
  styleUrl: './departments-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentsPage implements OnInit{
  authService = inject(AuthService);
  departmentService = inject(DepartmentsService);
  notificationService = inject(NotificationsService);
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  router = inject(Router);

  isLoading = signal<boolean>(false);
  totalDeps = signal<number>(0);
  departments = signal<Department[]>([]);
  searchForm = this.fb.group({
    search: ['']
  })
  currentUser = toSignal(this.authService.currentUser$);

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe( value => {
        this.loadDepartments(value.search);
      }
    )
  }

  dialog = inject(MatDialog);
  openAddDepDialog(){
    const dialogRef = this.dialog.open(NewDepartmentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const { name, code } = result;
        const message = `${name}${code ? ` (${code})` : ''} department added correctly`;
        this.notificationService.success(message);
        this.loadDepartments();
      }
    })
  }

  loadDepartments(search?: string) {
    this.isLoading.set(true);
    this.departmentService.getDepartments(search).pipe(
      finalize(() => this.isLoading.set(false))
    )
    .subscribe(res => {
      this.totalDeps.set(res.count ?? 0);
      this.departments.set(res.results ?? []);
    })
  }

  onDepCardAction(event: {dep: Department, action: string}){
    const { dep, action } = event;
    if (action === 'delete'){
      this.deleteDepartment(dep);
    } else {
      this.updateDepartment(dep);
    }
  }

  deleteDepartment(dep: Department){
    const dialogRef = this.dialog.open(DeleteDepartmentDialog, {
        data: dep,
      });
      dialogRef.afterClosed().subscribe((message) => {
        if (!message) return;
        this.notificationService.info(message);
        this.loadDepartments();
      })
  }

  updateDepartment(dep: Department) {
    const dialogRef = this.dialog.open(EditDepartmentDialog, {
      data: dep,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      if (result.error){
        this.notificationService.error(result.message);
      } else {
        const message = `Department: ${result.data.name} updated correctly`;
        this.notificationService.success(message);
        this.loadDepartments();
      }
    })
  }

  getDepDetails(id: number){
    this.router.navigate(['/departments', id]);
  }
 }
