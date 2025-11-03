import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogContent } from "@angular/material/dialog";

@Component({
  selector: 'logout-dialog',
  imports: [MatIconModule, MatDialogContent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  template: 'passed in {{ data.title }}'
})
export class DialogComponent { 

  public data: { 
    title: string,
    success: boolean,
    message: string,
  } = inject(MAT_DIALOG_DATA);
}
