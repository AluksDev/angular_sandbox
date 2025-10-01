import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { AutoAlias } from '@api/defs/AutoAlias';
import { Period } from '@api/defs/Period';
import { TimetableperiodTimetableperiodFormService } from '@api/forms/timetableperiod/timetableperiod/timetableperiod.service';
import { DateTimePickerComponent } from '@utils/components/date-time-picker/date-time-picker.component';
import { QuillEditorComponent } from 'ngx-quill';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-timetable-period-dialog',
  templateUrl: './timetable-period-dialog.component.html',
  styleUrls: ['./timetable-period-dialog.component.scss'],
  providers: [DatePipe, TimetableperiodTimetableperiodFormService],
  imports: [
    DateTimePickerComponent,
    ReactiveFormsModule,
    MatSlideToggle,
    QuillEditorComponent,
    AsyncPipe,
    MatDialogTitle,
    MatButton,
    MatDialogClose,
  ],
})
export class TimetablePeriodDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  period = inject<Period | null>(MAT_DIALOG_DATA);
  autoAliasFS = inject(TimetableperiodTimetableperiodFormService);
  private dialogRef = inject<MatDialogRef<TimetablePeriodDialogComponent>>(MatDialogRef);

  public form: FormGroup;
  public auto_alias$: Observable<string>;
  public auto_alias: string;

  public wysiwygConfig = {
    toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']],
    clipboard: {
      matchVisual: false,
    },
  };

  // /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: -1,
      from: '',
      to: '',
      alias: '',
      custom_alias: false,
    });

    // If we are editing fill the data
    if (this.period) {
      this.form.patchValue({
        id: this.period.id,
        from: this.period.start_date,
        to: this.period.end_date,
        alias: this.period.alias.replace(/<br\s*\/?>/gi, '\n'),
        custom_alias: false,
      });

      // Check for custom alias
      if (this.form.value.alias !== '') {
        this.form.patchValue({
          custom_alias: true,
        });
      }
      this.calculateAutoAlias();
    }
  }

  calculateAutoAlias(): Observable<string> {
    if (this.form.valid) {
      this.auto_alias$ = this.autoAliasFS
        .submit({
          data: {
            start_date: this.datePipe.transform(this.form.value.from, 'yyyy-MM-dd'),
            end_date: this.datePipe.transform(this.form.value.to, 'yyyy-MM-dd'),
          },
        })
        .pipe(
          map((val: AutoAlias) => {
            this.auto_alias = val.auto_alias;
            return val.auto_alias;
          }),
        );
      return this.auto_alias$;
    }
  }

  confirm(): void {
    this.calculateAutoAlias()
      .pipe(
        map((val) => {
          this.dialogRef.close(this.closeDialog());
          return val;
        }),
      )
      .subscribe();
  }

  closeDialog(): Period {
    return {
      id: this.form.value.id,
      alias: this.form.value.custom_alias ? this.form.value.alias.replace(/\n/g, '<br>') : '',
      auto_alias: this.auto_alias,
      start_date: this.form.value.from,
      end_date: this.form.value.to || null,
      days: [],
    };
  }
}
