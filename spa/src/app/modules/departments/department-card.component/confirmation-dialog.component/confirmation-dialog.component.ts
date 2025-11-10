import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { DepartmentService } from '@modules/departments/department.service';
import { NotificationService } from '@utils/services/notification.service';

interface DialogData {
  title: string,
  message: string,
  itemName?: string,
  id: number
}

@Component({
  selector: 'app-confirmation-dialog.component',
  imports: [MatDialogActions, MatDialogContent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent { 

  readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  private _notificationService = inject(NotificationService);
  
  departmentService = inject(DepartmentService);
  


  delete(){
     this.departmentService.delete(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (err) => {
        this._notificationService.showError(`Error al eliminar: ${err.message || 'Error de conexión'}`);
      }
    });
  }
}
