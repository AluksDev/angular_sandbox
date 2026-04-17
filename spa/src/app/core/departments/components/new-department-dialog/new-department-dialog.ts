import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { DepartmentsService } from '../../departments.service';
import { Department } from '@api/departments/DTOs/department.interface';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-new-department-dialog',
  imports: [FormInputComponent, ReactiveFormsModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './new-department-dialog.html',
  styleUrl: './new-department-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDepartmentDialog {
  departmentService = inject(DepartmentsService);
  dialogRef = inject(MatDialogRef<NewDepartmentDialog>);
  loading = signal<boolean>(false);
  _snackBar = inject(MatSnackBar);

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
    this.loading.set(true);
    const formData = this.newDepForm.getRawValue();
    this.departmentService.addDepartment(formData)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (res: Department) => {
          this.dialogRef.close(res);
        },
        error: (err)=> {
          const errors = err.error;
          if (Object.keys(errors).find(key=> key === 'code' || key === 'name')){
            this._snackBar.open('This department name or code already exists', 'Close', {
                duration: 3000
              });
          } else {
              this._snackBar.open('Something went wrong', 'Close', {
                duration: 3000
              });
            }
          }
      })
  }
 }
