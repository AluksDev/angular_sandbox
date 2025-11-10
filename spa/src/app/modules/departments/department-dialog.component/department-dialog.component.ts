import { Component, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DepartmentFormComponent } from "./department-form.component/department-form.component";
import { DepartmentService } from '../department.service';
import { NotificationService } from '@utils/services/notification.service';
import { Department } from '@api/defs/Department';


interface DialogData {
  mode: 'create' | 'edit'
  department?: Department
}

@Component({
  selector: 'department-dialog',
  imports: [MatDialogModule, DepartmentFormComponent],
  templateUrl: './department-dialog.component.html',
  styleUrl: './department-dialog.component.css'
})
export class DepartmentDialogComponent { 

  private _notificationService = inject(NotificationService);
  readonly dialogRef = inject(MatDialogRef<DepartmentDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  departmentService = inject(DepartmentService);

  @ViewChild('form') 
  departmentFormRef!: DepartmentFormComponent;


  onSubmit(){
    
    if (!this.departmentFormRef) {
      console.error("Referencia al formulario no encontrada.");
      return;
    }

    const form = this.departmentFormRef.departmentForm;
    form.markAllAsTouched();
    
    if (form.valid) {
      if(this.data.mode == 'create'){
        this.departmentService.create(form.value).subscribe({
          error: (err) => {
            this._notificationService.showError(`Error al crear: ${err.message || 'Error de conexión'}`);
          }
        });
      }
      else{
        this.departmentService.update( this.data.department.id ,form.value).subscribe({
          error: (err) => {
            this._notificationService.showError(`Error al actualizar: ${err.message || 'Error de conexión'}`);
          }
        });
      }
      
      this.dialogRef.close(form.value); 
    }
  }

}
