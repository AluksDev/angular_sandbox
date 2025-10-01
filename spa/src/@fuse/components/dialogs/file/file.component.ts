import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';

export interface DialogData {
  title: string;
  text: string;
  fileAccept: string;
}

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',

  styleUrls: ['./file.component.scss'],
  imports: [MatDialogModule, ReactiveFormsModule, MatButtonModule, FileUploadModule, MatLabel],
})
export class FileDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<FileDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  public uploader: FileUploader;
  public form: FormGroup;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor(private fb: FormBuilder) {
    // Configura el formulario
    this.form = this.fb.group({
      myField: [null],
    });
  }

  ngOnInit(): void {
    if (!this.data.fileAccept) {
      this.data.fileAccept = '*';
    }
  }
}
