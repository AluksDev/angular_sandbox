import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {  MatIconModule } from '@angular/material/icon';
import { Department } from '@api/departments/DTOs/department.interface';
import { DepartmentsService } from '../../../../core/services/departments.service';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-delete-department-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './delete-department-dialog.html',
  styleUrl: './delete-department-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDepartmentDialog { 
  departmentService = inject(DepartmentsService);
  dialogRef = inject(MatDialogRef<DeleteDepartmentDialog>);
  dep = inject<Department>(MAT_DIALOG_DATA);
  loading = signal<boolean>(false);

  onDeleteConfirm(){
    this.loading.set(true);
    let message = '';
    this.departmentService.deleteDepartmentById(this.dep.id)
      .pipe(
        finalize(()=>{
          this.loading.set(false);
          this.dialogRef.close(message);
        })
      )
      .subscribe({
        next: (()=> {
          message = 'Department deleted successfully';
        }),
        error: ((err) => {
          message = 'Something went wrong';
        })
    })
  }
}
