// eslint-disable-next-line angularCustom/validate-component-providers
import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  OnInit,
  output,
  viewChild,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import moment, { Moment } from "moment";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerToggle,
} from "@angular/material/datepicker";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatInputModule } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";


const MOMENT_FORMATS = {
  parse: {
    dateInput: "LL",
  },
  display: {
    monthYearLabel: "MMM YYYY",
    // See DateFormats for other required formats.
  },
};

@Component({
  selector: "app-date-time-picker",
  templateUrl: "./date-time-picker.component.html",
  styleUrls: ["./date-time-picker.component.scss"],

  imports: [
    MatDatepickerToggle,
    MatDatepicker,
    MatInputModule,
    FormsModule,
    MatDatepickerInput,
    MatIcon,
    MatSelectModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MOMENT_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "ca-ES" },
  ],
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor {
  private cdr = inject(ChangeDetectorRef);

  datetime: string;
  _datetime: Moment;
  pretty_datetime: string;
  showTimePicker = false;

  placeholder = input("");
  serverErrors = input<any>();
  frontErrors = input<any>();
  control = input<any>();
  type = input<"datetime" | "date" | "time">("datetime");
  min = input<any>();
  max = input<any>();

  change = output<string>();

  component_value: Date | null = null;
  disabled = false;

  // Time options
  selectedTime: string = "00:00";

  timeOptions: string[] = Array.from({ length: 24 * 60 }, (_, i) => {
    const h = String(Math.floor(i / 60)).padStart(2, "0");
    const m = String(i % 60).padStart(2, "0");
    return `${h}:${m}`;
  }).filter((time) => +time.split(":")[1] % 5 === 0);

  // ViewChilds
  readonly matInput = viewChild<{
    nativeElement: { blur: () => void };
  }>("matInput");

  constructor() {
    this._datetime = null;
  }

  ngOnInit(): void {
    const value = this.control() ? this.control()!.value : null;
    this.component_value = value ? moment(value).toDate() : null;
    this.update();
  }

  update(): void {
    if (this._datetime === null) {
      this.datetime = null;
      this.pretty_datetime = "";
      this.component_value = null;
    } else {
      if (this.type() === "datetime") {
        this.datetime = this._datetime.toISOString();
        this.pretty_datetime = this._datetime.format("DD/MM/YYYY HH:mm");
      } else if (this.type() === "date") {
        this.datetime = this._datetime.format("YYYY-MM-DD");
        this.pretty_datetime = this._datetime.format("DD/MM/YYYY");
      } else if (this.type() === "time") {
        this.datetime = this._datetime.format("HH:mm");
        this.pretty_datetime = this.datetime;
      }
      this.component_value = this._datetime.toDate();
    }

    try {
      this.cdr.detectChanges();
    } catch {}
  }

  // CVA
  propagateChange = (_: any) => {};
  touched = () => {};

  writeValue(value: any): void {
    if (value !== undefined && value !== null && value !== "") {
      this._datetime =
        this.type() === "time" ? moment(value, "HH:mm") : moment(value);

      this.selectedTime = this._datetime.format("HH:mm");
    } else {
      this._datetime = null;
      this.component_value = null;
      this.selectedTime = "00:00";
    }

    this.update();
  }

  registerOnChange(fn: (_: any) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  dateChange($event: MatDatepickerInputEvent<Moment>): void {
    if (!$event.value) {
      return;
    }

    const [hour, minute] = this.selectedTime.split(":");

    this._datetime = moment($event.value).set({
      hour: parseInt(hour, 10),
      minute: parseInt(minute, 10),
    });

    this.showTimePicker = this.type() === "datetime" || this.type() === "time";

    this.update();
    this.propagateChange(this.datetime);
    this.change.emit(this.datetime);
  }

  onTimeChange(value: string): void {
    this.selectedTime = value;

    if (!this._datetime) {
      this._datetime = moment();
    }

    const [hour, minute] = value.split(":");

    this._datetime.set({
      hour: parseInt(hour, 10),
      minute: parseInt(minute, 10),
    });

    this.update();
    this.propagateChange(this.datetime);
    this.change.emit(this.datetime);
  }

  inputChange($event: Event): void {
    let in_format, out_format;
    if (this.type() === "date") {
      in_format = "DD/MM/YYYY";
      out_format = "YYYY-MM-DD";
    } else if (this.type() === "datetime") {
      in_format = "DD/MM/YYYY HH:mm";
      out_format = "YYYY-MM-DD HH:mm";
    } else {
      in_format = "HH:mm";
      out_format = "HH:mm";
    }

    const raw = ($event.target as HTMLInputElement).value;
    const date = moment(raw, in_format, true);

    if (date.isValid()) {
      this.datetime = date.format(out_format);
      this._datetime = date;
      if (this.control()) this.control()!.setErrors(null);
    } else {
      this._datetime = null;
      if (this.control()) {
        this.control()!.setErrors({
          serverError: true,
          __errors: ["Data invàlida"],
        });
      }
    }

    this.update();
    this.propagateChange(this.datetime);
    this.change.emit(this.datetime);
  }

  inputFocus($event: { target: any }): void {
    if (this.type() === "time" && this._datetime === null) {
      this.pretty_datetime = ":00";
    }
  }

  delete(): void {
    setTimeout(() => {
      this.matInput().nativeElement.blur();
      this._datetime = null;
      this.datetime = "";
      this.pretty_datetime = "";
      this.showTimePicker = false;
      this.update();
      this.propagateChange(this.datetime);
      this.change.emit(this.datetime);
    });
  }

  closedModal(): void {
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
}
