import { ChangeDetectionStrategy, Component, Injector, input } from '@angular/core';
import { BaseFormControlAccessor } from '../../utils/control-value-accessor-base';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ErrorMessages } from '../../error-messages';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-form-datepicker-component',
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatIconModule, MatNativeDateModule],
  templateUrl: './form-datepicker-component.html',
  styleUrl: './form-datepicker-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: FormDatepickerComponent,
        multi: true
      }
    ]
})
export class FormDatepickerComponent extends BaseFormControlAccessor{ 
  appearance= input<string>('outline');
  label = input<string>('Choose a date');
  hint = input<string>('MM/DD/YYYY');
  required = input<boolean>(false);
  iconName = input<string>('calendar_month')

  constructor(injector: Injector){
    super(injector);
    if (!this.formControl) return;
    const validators = [];
    if (this.required()){
      validators.push(Validators.required)
    }
    this.formControl!.setValidators(validators);
    this.formControl!.updateValueAndValidity();
  }

  getErrorMessage(): string | null{
    if (!this.formControl.errors) return null;
    return ErrorMessages.getErrorMessage(this.formControl.errors);
  }
}
