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
}

@Component({
  selector: 'app-yesno',
  templateUrl: './yesno.component.html',
  imports: [MatButton, MatDialogActions, MatDialogContent, MatDialogTitle, MatDialogClose],
  styleUrls: ['./yesno.component.scss'],
})
export class YesNoDialogComponent {
  dialogRef = inject<MatDialogRef<YesNoDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
}
