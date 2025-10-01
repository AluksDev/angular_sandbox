import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TimetableDescription } from '@api/model';
import { QuillModule } from 'ngx-quill';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-timetable-comment-dialog',
  templateUrl: './timetable-comment-dialog.component.html',
  styleUrls: ['./timetable-comment-dialog.component.scss'],

  imports: [ReactiveFormsModule, QuillModule, MatDialogModule, MatButtonModule],
})
export class TimetableCommentDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  comment = inject<TimetableDescription | null>(MAT_DIALOG_DATA);

  public form: FormGroup;
  public wysiwygConfig = {
    toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']],
    clipboard: {
      matchVisual: false,
    },
  };

  public wysiwygFormats: string[] = [
    //'background',
    'bold',
    //'color',
    //'font',
    //'code',
    'italic',
    'link',
    //'size',
    //'strike',
    //'script',
    'underline',
    //'blockquote',
    //'header',
    //'indent',
    'list',
    //'align',
    //'direction',
    //'code-block',
    //'formula',
    //'image',
    //'video',
  ];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: -1,
      alias: '',
    });

    if (this.comment) {
      this.form.patchValue({
        id: this.comment.id,
        alias: this.comment.text,
      });
    }
  }

  closeDialog(): TimetableDescription {
    return {
      id: this.form.value.id,
      front_id: this.form.value.id,
      text: this.form.value.alias,
    };
  }
}
