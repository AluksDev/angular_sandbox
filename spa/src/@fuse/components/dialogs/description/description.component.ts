import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  title: string;
  text: string;
}

@Component({
  selector: 'app-dialog-description',
  templateUrl: './description.component.html',

  styleUrls: ['./description.component.scss'],
  imports: [MatDialogModule, MatInputModule, MatInputModule, MatButtonModule],
})
export class DescriptionDialogComponent {
  dialogRef = inject<MatDialogRef<DescriptionDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
}
