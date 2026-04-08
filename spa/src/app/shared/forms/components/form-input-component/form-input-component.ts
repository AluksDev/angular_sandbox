import { ChangeDetectionStrategy, Component, effect, inject, input, Optional, signal } from '@angular/core';
import { MatError, MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-input-component',
  standalone: true,
  imports: [MatFormField, MatLabel, MatInput, MatHint, MatError, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './form-input-component.html',
  styleUrls: ['./form-input-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormInputComponent,
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor {
  label = input.required<string>();
  type = input.required<string>();
  placeholder = input<string>();
  hint = input<string>();
  required = input.required<boolean>();
  minLength = input<number>();
  maxLength = input<number>();
  control = input.required<FormControl | null>();


  value: string = '';
  disabled: boolean = false;
  isValid= signal<boolean>(false)

  constructor(){
    effect(() => {
      if (!this.control()) return;
      const validators = [];
      if (this.required()) {
        validators.push(Validators.required);
      }
      if (this.maxLength()) {
        validators.push(Validators.maxLength(this.maxLength()));
      }
      if (this.minLength()) {
        validators.push(Validators.minLength(this.minLength()));
      }
      if (this.type() === 'email'){
        validators.push(Validators.email)
      }
      this.control()!.setValidators(validators);
      this.control()!.updateValueAndValidity();
    })
  }

  private onChange = (v: any) => {};
  private onTouched = () => {};


  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  getErrorMessage(): string | null{
    if (!this.control().errors) return null;
    const errors = this.control().errors ?? {};
    for (const key of Object.keys(errors)){
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'minlength':
          return `Minimum length required is ${errors[key].requiredLength} characters`
        case 'email':
          return 'It must be a valid email'
      }
    }
  }
}