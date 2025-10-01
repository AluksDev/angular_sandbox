import { Component, inject, OnInit, SimpleChange, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AutoAlias, TimetableDay, TimetableGlobaldayList } from '@api/model';
import { AsyncPipe, DatePipe, JsonPipe, KeyValuePipe } from '@angular/common';
import {
  TimetabledaydetailTimetabledaydetailFormService,
  TimetabledayTimetabledayFormService,
  TimetableGlobaldayListFormService,
} from '@api/form-service';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { QuillModule } from 'ngx-quill';
import moment from 'moment';

@Component({
  selector: 'app-timetable-day-dialog',
  templateUrl: './timetable-day-dialog.component.html',
  styleUrls: ['./timetable-day-dialog.component.scss'],
  providers: [
    DatePipe,
    TimetableGlobaldayListFormService,
    TimetabledaydetailTimetabledaydetailFormService,
    TimetabledayTimetabledayFormService,
  ],
  imports: [
    ReactiveFormsModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatSelect,
    MatOptionModule,
    DatePipe,
    MatDatepickerModule,
    KeyValuePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    QuillModule,
    AsyncPipe,
    JsonPipe,
  ],
})
export class TimetableDayDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private timetableGlobaldayListFormService = inject(TimetableGlobaldayListFormService);
  day = inject<TimetableDay | null>(MAT_DIALOG_DATA);
  autoAliasDetailFS = inject(TimetabledaydetailTimetabledaydetailFormService);
  autoAliasFS = inject(TimetabledayTimetabledayFormService);

  public form: FormGroup;
  public dayForm: FormGroup;
  public globalDays: {};
  protected unsubscribe$: Subject<void> = new Subject();

  public wysiwygConfig = {
    toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']],
    clipboard: {
      matchVisual: false,
    },
  };

  public customizeAlias = false;
  public days = [];
  public selectedSpecificDays = [];

  public day_auto_alias: string;

  public periodicities = [
    { id: 0, name: '-' },
    { id: 1, name: '1r dia' },
    { id: 2, name: '2n dia' },
    { id: 3, name: '3r dia' },
    { id: 4, name: '4rt dia' },
    { id: 5, name: '5é dia' },
    { id: -2, name: 'Penúltim dia' },
    { id: -1, name: 'Últim dia' },
  ];

  displayedColumns = ['icon', 'dayalias', 'actions'];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]); // Columns to show

  constructor() {}

  readonly calendar = viewChild<MatCalendar<Date>>('calendar');

  ngOnInit(): void {
    // Create day form
    this.dayForm = this.formBuilder.group({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,

      all: false,
      periodicity: 0,
      holidays: false,
      holidayEves: false,
      specificDays: [],
      globalDays: [],
      exclude: false,
    });

    // Create main form
    this.form = this.formBuilder.group({
      id: -1,
      front_id: -1,
      alias: '',
      auto_alias: '',
      custom_alias: false,
    });

    this.day_auto_alias = '';
    // If we are editing fill the data
    if (this.day) {
      this.day_auto_alias = this.day.auto_alias;
      // Fill Day Detail data
      const days = [];
      this.day.day_details.forEach((day) =>
        days.push({
          monday: day.monday,
          tuesday: day.tuesday,
          wednesday: day.wednesday,
          thursday: day.thursday,
          friday: day.friday,
          saturday: day.saturday,
          sunday: day.sunday,

          all: day.monday && day.tuesday && day.wednesday && day.thursday && day.friday && day.saturday && day.sunday,
          periodicity: day.day_of_month,
          holidays: day.holiday,
          holidayEves: day.holiday_eve,
          specificDays: day.exact_day ? [moment(day.exact_day, 'YYYY-MM-DD')] : null,
          globalDays: day.global_day ? [day.global_day] : null,
          exclude: !day.included,
        }),
      );

      this.days = days;
      this.days.forEach((day) => this.calculateAutoAlias(day));

      this.form.patchValue({
        id: this.day.id,
        front_id: this.day.front_id,
        alias: this.day.alias.replace(/<br\s*\/?>/gi, '\n'),
        custom_alias: false,
      });

      // Check for custom alias
      if (this.form.value.alias !== '') {
        this.form.patchValue({
          auto_alias: this.day.alias.replace(/<br\s*\/?>/gi, '\n'),
          custom_alias: true,
        });
      }
    }
    this.calculateFullAutoAlias();

    // Get global day list
    this.timetableGlobaldayListFormService
      .submit({ limit: 100 })
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((globalDays: TimetableGlobaldayList) => {
          this.globalDays = globalDays.results.reduce((acum, globalDay) => {
            acum[globalDay.id] = globalDay;
            return acum;
          }, {});
        }),
      )
      .subscribe();
  }

  updateAllDaysCheck(): void {
    if (
      this.dayForm.value.monday &&
      this.dayForm.value.tuesday &&
      this.dayForm.value.wednesday &&
      this.dayForm.value.thursday &&
      this.dayForm.value.friday &&
      this.dayForm.value.saturday &&
      this.dayForm.value.sunday
    ) {
      this.dayForm.patchValue({
        all: true,
      });
    } else {
      this.dayForm.patchValue({
        all: false,
      });
    }
  }

  selectAllDays(event: MatCheckboxChange): void {
    if (event.checked) {
      this.dayForm.patchValue({
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      });
    } else {
      if (
        this.dayForm.value.monday &&
        this.dayForm.value.tuesday &&
        this.dayForm.value.wednesday &&
        this.dayForm.value.thursday &&
        this.dayForm.value.friday &&
        this.dayForm.value.saturday &&
        this.dayForm.value.sunday
      ) {
        this.dayForm.patchValue({
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        });
      }
    }
  }

  /**
   * Filter to disable already selected days
   */
  dateFilter = (d: Date): boolean => this.selectedSpecificDays.findIndex((e) => e.toString() === d.toString()) === -1;

  /**
   *  Add selected days as 'include'
   */
  include(): void {
    // Check if we have any ciclic days
    if (
      this.dayForm.value.monday ||
      this.dayForm.value.tuesday ||
      this.dayForm.value.wednesday ||
      this.dayForm.value.thursday ||
      this.dayForm.value.friday ||
      this.dayForm.value.saturday ||
      this.dayForm.value.sunday ||
      this.dayForm.value.all ||
      this.dayForm.value.holidays ||
      this.dayForm.value.holidayEves
    ) {
      this.days = [
        ...this.days,
        {
          monday: this.dayForm.value.monday,
          tuesday: this.dayForm.value.tuesday,
          wednesday: this.dayForm.value.wednesday,
          thursday: this.dayForm.value.thursday,
          friday: this.dayForm.value.friday,
          saturday: this.dayForm.value.saturday,
          sunday: this.dayForm.value.sunday,
          all: this.dayForm.value.all,
          periodicity: this.dayForm.value.periodicity,
          holidays: this.dayForm.value.holidays,
          holidayEves: this.dayForm.value.holidayEves,
          exclude: this.dayForm.value.exclude,
        },
      ];
    }

    // Check if we have any specific dates
    if (this.dayForm.value.specificDays && this.dayForm.value.specificDays.length > 0) {
      this.dayForm.value.specificDays.forEach(
        (day) =>
          (this.days = [
            ...this.days,
            {
              exclude: this.dayForm.value.exclude,
              specificDays: [day],
            },
          ]),
      );
    }

    // Check if we have any global dates
    if (this.dayForm.value.globalDays && this.dayForm.value.globalDays.length > 0) {
      this.dayForm.value.globalDays.forEach(
        (day) =>
          (this.days = [
            ...this.days,
            {
              exclude: this.dayForm.value.exclude,
              globalDays: [day],
            },
          ]),
      );
    }

    this.days.forEach((day) => {
      if (!day.auto_alias) {
        this.calculateAutoAlias(day);
      }
    });
    this.calculateFullAutoAlias();

    // Clear the dayForm
    this.cancel();
  }

  /**
   * Add selected days as 'exclude
   */
  exclude(): void {
    this.dayForm.patchValue({ exclude: true });
    this.include();
  }

  cancel(): void {
    // Clear the dayForm
    this.dayForm.reset({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,

      all: false,
      periodicity: 0,
      holidays: false,
      holidayEves: false,
      specificDays: [],
      globalDays: [],
      exclude: false,
    });
    this.selectedSpecificDays = [];
  }

  selectDate(event: any): void {
    this.selectedSpecificDays.push(event);
    this.dayForm.patchValue({ specificDays: this.selectedSpecificDays });
    this.calendar().ngOnChanges({
      dateFilter: new SimpleChange(null, this.dateFilter, false),
    });
  }

  moveUp(day: any): void {
    const index = this.days.indexOf(day);
    [this.days[index], this.days[index - 1]] = [this.days[index - 1], this.days[index]];
    this.days = [...this.days];
    this.calculateFullAutoAlias();
  }

  moveDown(day: any): void {
    const index = this.days.indexOf(day);
    [this.days[index], this.days[index + 1]] = [this.days[index + 1], this.days[index]];
    this.days = [...this.days];
    this.calculateFullAutoAlias();
  }

  remove(day: any): void {
    const index = this.days.indexOf(day);
    this.days.splice(index, 1);
    this.days = [...this.days];
    this.calculateFullAutoAlias();
  }

  calculateAutoAlias(day: any): void {
    day['auto_alias$'] = this.autoAliasDetailFS
      .submit({
        data: {
          monday: day.monday,
          tuesday: day.tuesday,
          wednesday: day.wednesday,
          thursday: day.thursday,
          friday: day.friday,
          saturday: day.saturday,
          sunday: day.sunday,
          day_of_month: day.periodicity,
          holiday: day.holidays,
          holiday_eve: day.holidayEves,
          exact_day: day.specificDays ? day.specificDays[0] : null,
          global_day: day.globalDays ? day.globalDays[0] : null,
          included: !day.exclude,
        },
      })
      .pipe(
        map((val: AutoAlias) => {
          day.auto_alias = val.auto_alias;
          return val.auto_alias;
        }),
      );
  }

  calculateFullAutoAlias(): void {
    const data = {
      day_details: [],
    };
    this.days.forEach((day) =>
      data.day_details.push({
        monday: day.monday,
        tuesday: day.tuesday,
        wednesday: day.wednesday,
        thursday: day.thursday,
        friday: day.friday,
        saturday: day.saturday,
        sunday: day.sunday,
        day_of_month: day.periodicity,
        holiday: day.holidays,
        holiday_eve: day.holidayEves,
        exact_day: day.specificDays ? day.specificDays[0] : null,
        global_day: day.globalDays ? day.globalDays[0] : null,
        included: !day.exclude,
      }),
    );

    this.autoAliasFS
      .submit({ data: data })
      .pipe(
        map((val: AutoAlias) => {
          this.day_auto_alias = val.auto_alias;
          return val.auto_alias;
        }),
      )
      .subscribe();
  }

  toggleAutoAlias(): void {
    this.form.patchValue({ alias: '' });
  }

  closeDialog(): TimetableDay {
    const day_details = [];
    let order = 0;
    this.days.forEach((day) =>
      day_details.push({
        monday: day.monday,
        tuesday: day.tuesday,
        wednesday: day.wednesday,
        thursday: day.thursday,
        friday: day.friday,
        saturday: day.saturday,
        sunday: day.sunday,
        day_of_month: day.periodicity,
        holiday: day.holidays,
        holiday_eve: day.holidayEves,
        exact_day: day.specificDays ? day.specificDays[0] : null,
        global_day: day.globalDays ? day.globalDays[0] : null,
        included: !day.exclude,
        order: order++,
      }),
    );

    return {
      id: this.form.value.id,
      front_id: this.form.value.front_id,
      alias: this.form.value.custom_alias ? this.form.value.alias : '',
      auto_alias: this.day_auto_alias,
      day_details: day_details,
    };
  }

  closeEmpty(): TimetableDay {
    return {
      id: this.form.value.id,
      front_id: this.form.value.id,
      alias: '',
      auto_alias: '',
      day_details: [],
    };
  }
}
