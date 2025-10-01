import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

export interface DialogData {
  title: string;
  text: string;
  html: string;
  warnings?: string[];
}

@Component({
  selector: 'app-dialog-info',
  templateUrl: './info.component.html',

  imports: [MatDialogContent, MatDialogTitle, MatDialogActions, MatButton, MatDialogClose],
  styleUrls: ['./info.component.scss'],
})
export class InfoDialogComponent {
  dialogRef = inject<MatDialogRef<InfoDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
}
