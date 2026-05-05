import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { DepartmentsService } from '../../../../core/services/departments.service';
import { Department } from '@api/departments/DTOs/department.interface';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationsService } from '@app/core/notifications/notification.service';
import { LoadingService } from '@app/core/services/loading.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-new-department-dialog',
  imports: [FormInputComponent, ReactiveFormsModule, MatButtonModule, MatProgressSpinnerModule, AsyncPipe],
  templateUrl: './new-department-dialog.html',
  styleUrl: './new-department-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDepartmentDialog {
  departmentService = inject(DepartmentsService);
  dialogRef = inject(MatDialogRef<NewDepartmentDialog>);
  notificationService = inject(NotificationsService);
  loadingService = inject(LoadingService);
  loading$ = this.loadingService.loading$;
  fb = inject(FormBuilder);
  newDepForm = this.fb.group({
    name: [''],
    code: ['']
  })

  closeModal(){
    this.dialogRef.close();
  }
  onSubmit(){
    this.newDepForm.markAllAsTouched();
    if (this.newDepForm.invalid) return;
    const formData = this.newDepForm.getRawValue();
    this.departmentService.addDepartment(formData).subscribe({
        next: (res: Department) => {
          this.dialogRef.close(res);
        },
        error: (err)=> {
          const errors = err.error;
          if (Object.keys(errors).find(key=> key === 'code' || key === 'name')){
            this.notificationService.error('This department name or code already exists');
          }
        }
      })
  }
 }
