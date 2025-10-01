import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

export interface DialogData {
  title: string;
  text?: string;
  html?: string;
  warnings?: string[];
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',

  imports: [MatButton, MatDialogClose],
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmDialogComponent {
  dialogRef = inject<MatDialogRef<ConfirmDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
}
