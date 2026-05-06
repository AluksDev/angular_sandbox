import { ChangeDetectionStrategy, Component, effect, Injector, input } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BaseFormControlAccessor } from '../../utils/control-value-accessor-base';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule } from "@angular/material/form-field";
import { ErrorMessages } from '../../error-messages';

@Component({
  selector: 'app-form-checkbox-component',
  imports: [MatCheckboxModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-checkbox-component.html',
  styleUrl: './form-checkbox-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: FormCheckboxComponent,
        multi: true
      }
    ]
})
export class FormCheckboxComponent extends BaseFormControlAccessor { 
  label = input<string>();
  required = input<boolean>(false);
  labelPosition = input<'before' | 'after'>('after')
  errorMessage = input<string>();

  constructor(injector: Injector){
    super(injector);
    effect(() => {
      if (!this.formControl) return;
      const validators = [];
      if (this.required()) {
        validators.push(Validators.required);
      }
      this.formControl!.setValidators(validators);
      this.formControl!.updateValueAndValidity();
    })
  }
  getErrorMessage(): string | null{
    if (!this.formControl.errors) return null;
    if (this.errorMessage()) return this.errorMessage();
    return ErrorMessages.getErrorMessage(this.formControl.errors);
  }
}
