import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TimetableHour } from '@api/defs/TimetableHour';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { TimetablehourTimetablehourFormService } from '@api/forms/timetablehour/timetablehour/timetablehour.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DateTimePickerComponent } from '@utils/components/date-time-picker/date-time-picker.component';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { QuillModule } from 'ngx-quill';
import { AutoAlias } from '@api/defs/AutoAlias';

@Component({
  selector: 'app-timetable-hour-dialog',
  templateUrl: './timetable-hour-dialog.component.html',
  styleUrls: ['./timetable-hour-dialog.component.scss'],

  imports: [
    ReactiveFormsModule,
    DateTimePickerComponent,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    MatSlideToggleModule,
    QuillModule,
    MatIcon,
    MatButton,
    MatIconButton,
  ],
  providers: [TimetablehourTimetablehourFormService],
})
export class TimetableHourDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  hour = inject<TimetableHour | null>(MAT_DIALOG_DATA);
  autoAliasFS = inject(TimetablehourTimetablehourFormService);

  public form: FormGroup;
  public timeForm: FormGroup;

  public wysiwygConfig = {
    toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']],
    clipboard: {
      matchVisual: false,
    },
  };

  public hours = [];
  public auto_alias: string;

  displayedColumns = ['timeframe', 'actions'];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]); // Columns to show

  constructor() {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: -1,
      alias: '',
      auto_alias: '',
      custom_alias: false,
    });

    this.auto_alias = '';
    if (this.hour) {
      this.auto_alias = this.hour.auto_alias;
      // Fill Hour Detail data
      const hours = [];
      this.hour.hour_details.forEach((hour) =>
        hours.push({
          from: this.getHourString(hour.start_hour, hour.start_minute),
          to: this.getHourString(hour.end_hour, hour.end_minute),
        }),
      );
      this.hours = hours;

      this.form.patchValue({
        id: this.hour.id,
        alias: this.hour.alias.replace(/<br\s*\/?>/gi, '\n'),
        custom_alias: !!this.hour.alias,
      });
    }

    this.calculateAutoAlias();

    this.timeForm = this.formBuilder.group({
      from: [{ value: '', disabled: false }],
      to: [{ value: '', disabled: false }],
      allday: false,
    });
  }

  public set24hours(value: MatCheckboxChange): void {
    if (value.checked) {
      this.timeForm.get('from').disable();
      this.timeForm.get('to').disable();
    } else {
      this.timeForm.get('from').enable();
      this.timeForm.get('to').enable();
    }
  }

  private getHourString(hour: number, minutes: number): string {
    if (hour === undefined || minutes === undefined || hour === null || minutes === null) {
      return '';
    }

    const hourString = hour < 10 ? '0' + hour : hour.toString();
    const minuteString = minutes < 10 ? '0' + minutes : minutes.toString();

    return hourString + ':' + minuteString;
  }

  addHour(): void {
    if (this.timeForm.value.allday) {
      this.timeForm.get('from').enable();
      this.timeForm.get('to').enable();
      this.timeForm.patchValue({ from: '00:00', to: '00:00' });
    }

    this.hours = [...this.hours, this.timeForm.value];
    this.timeForm.reset();
    this.timeForm.patchValue({ from: '', to: '' });
    this.calculateAutoAlias();
  }

  cancel(): void {
    this.timeForm.reset();
  }

  moveUp(hour: any): void {
    const index = this.hours.indexOf(hour);
    [this.hours[index], this.hours[index - 1]] = [this.hours[index - 1], this.hours[index]];
    this.hours = [...this.hours];
    this.calculateAutoAlias();
  }

  moveDown(hour: any): void {
    const index = this.hours.indexOf(hour);
    [this.hours[index], this.hours[index + 1]] = [this.hours[index + 1], this.hours[index]];
    this.hours = [...this.hours];
    this.calculateAutoAlias();
  }

  remove(hour: any): void {
    const index = this.hours.indexOf(hour);
    this.hours.splice(index, 1);
    this.hours = [...this.hours];
    this.calculateAutoAlias();
  }

  calculateAutoAlias(): void {
    const data = {
      hour_details: [],
    };

    this.hours.forEach((hour) => {
      const h: any = {};
      if (hour.from) {
        h.start_hour = parseInt(hour.from.split(':')[0], 10);
        h.start_minute = parseInt(hour.from.split(':')[1], 10);
      }
      if (hour.to) {
        h.end_hour = parseInt(hour.to.split(':')[0], 10);
        h.end_minute = parseInt(hour.to.split(':')[1], 10);
      }

      data.hour_details.push(h);
    });

    this.autoAliasFS
      .submit({ data: data })
      .pipe(
        map((val: AutoAlias) => {
          this.auto_alias = val.auto_alias;
          return val.auto_alias;
        }),
      )
      .subscribe();
  }

  toggleAutoAlias(): void {
    this.form.patchValue({ alias: '' });
  }

  closeDialog(): TimetableHour {
    const hour_details = this.hours.map((hour, index) => {
      const h = {
        start_hour: null,
        start_minute: null,
        end_hour: null,
        end_minute: null,
        order: index,
      };

      if (hour.from) {
        h.start_hour = parseInt(hour.from.split(':')[0], 10);
        h.start_minute = parseInt(hour.from.split(':')[1], 10);
      }

      if (hour.to) {
        h.end_hour = parseInt(hour.to.split(':')[0], 10);
        h.end_minute = parseInt(hour.to.split(':')[1], 10);
      }
      return h;
    });

    return {
      id: this.form.value.id,
      front_id: this.form.value.id,
      alias: this.form.value.custom_alias ? this.form.value.alias.replace(/\n/g, '<br>') : '',
      auto_alias: this.auto_alias,
      hour_details: hour_details,
    };
  }
}
