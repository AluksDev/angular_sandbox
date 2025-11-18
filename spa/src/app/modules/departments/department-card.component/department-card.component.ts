import { Component, inject, input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Department } from '@api/defs/Department';
import { MatIcon } from "@angular/material/icon";
import { DepartmentService } from '../department.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentDialogComponent } from '../department-dialog.component/department-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component/confirmation-dialog.component';

@Component({
  selector: 'department-card',
  imports: [MatCardModule, MatIcon, MatSnackBarModule],
  templateUrl: './department-card.component.html',
  styleUrl: './department-card.component.css'
})
export class DepartmentCardComponent {
  
  private _dialog = inject(MatDialog);

  departmentService = inject(DepartmentService);

  department = input.required<Department>()
  
  onDelete(id: number) {
    this._dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { 
        title: 'Confirmación de Eliminación',
        message: '¿Está absolutamente seguro de que desea eliminar este departamento?',
        itemName: this.department().name,
        id: id
      }
    });

   
  }
  
  onEdit() {
    this._dialog.open(DepartmentDialogComponent, {
      width: '400px',
      data: { 
        mode: 'edit',
        department: this.department()
      }
    });
  }
}
