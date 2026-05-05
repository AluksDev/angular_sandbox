import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormInputComponent } from '@app/shared/forms/components/form-input-component/form-input-component';
import { DepartmentsService } from '../../../../core/services/departments.service';
import { Department } from '@api/departments/DTOs/department.interface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-edit-department-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, FormInputComponent, MatProgressSpinnerModule],
  templateUrl: './edit-department-dialog.html',
  styleUrl: './edit-department-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditDepartmentDialog { 
  dialogRef = inject(MatDialogRef<EditDepartmentDialog>);
  dep = inject<Department>(MAT_DIALOG_DATA);
  departmentService = inject(DepartmentsService);
  loading = signal<boolean>(false);

  fb = inject(FormBuilder);
  editDepForm = this.fb.group({
    name: [this.dep.name],
    code : [this.dep.code]
  })

  closeModal(){
    this.dialogRef.close();
  }

  onSubmit(){
    if (this.editDepForm.invalid) return;
    this.loading.set(true);
    const updatedData = {id: this.dep.id, ...this.editDepForm.getRawValue()};
    this.departmentService.updateDepartment(updatedData)
      .pipe(
        finalize(()=> this.loading.set(false))
      )
      .subscribe({
        next: ((res) => {
          this.dialogRef.close({error: false, data: res});
        }),
        error: ((err) => {
          this.dialogRef.close({error: true, message: 'Something went wrong'})
        })
      })
  }
}
