import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SupportVideoComponent } from '../support/support.component';

export interface DialogConfig {
  videos: string[];
}

@Component({
  selector: 'app-support-dialog',
  templateUrl: './support-dialog.component.html',

  imports: [SupportVideoComponent],
  styleUrls: ['./support-dialog.component.scss'],
})
export class SupportDialogComponent {
  dialogRef = inject<MatDialogRef<SupportDialogComponent>>(MatDialogRef);
  config = inject<DialogConfig>(MAT_DIALOG_DATA);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
}
