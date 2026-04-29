import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-message-dialog-component',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './message-dialog-component.html',
  styleUrl: './message-dialog-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageDialogComponent {
  readonly dialogRef = inject(MatDialogRef<MessageDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onConfirm(){
    this.dialogRef.close('back');
  }
 }
