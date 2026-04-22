import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, Injector, input, OnInit, signal, ViewChild } from '@angular/core';
import { MatError, MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { ControlValueAccessor, FormControl, FormControlDirective, FormControlName, FormGroupDirective, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlAccessor } from '../../utils/control-value-accessor-base';
import { MatIcon } from '@angular/material/icon';
import { PasswordStrengthComponent } from '../password-strength-component/password-strength-component';
import { CustomValidators } from '../../custom-validators';

@Component({
  selector: 'app-form-input-component',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatIcon, MatInputModule, FormsModule, PasswordStrengthComponent],
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
export class FormInputComponent extends BaseFormControlAccessor implements AfterViewInit {
  label = input.required<string>();
  type = input.required<string>();
  required = input.required<boolean>();
  placeholder = input<string>();
  hint = input<string>();
  minLength = input<number>();
  maxLength = input<number>();
  iconName = input<string>();
  appearance= input<string>('outline')
  autofocus = input<boolean>(false);
  pswStrengthCheck = input<boolean>(false);
  validPattern = input<string>();

  @ViewChild('inputElement') inputElement!: ElementRef;


  constructor(injector: Injector){
    super(injector);
    effect(() => {
      if (!this.formControl) return;
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
      if (this.validPattern()){
        validators.push(CustomValidators.validatePatter(this.validPattern()));
      }
      this.formControl!.setValidators(validators);
      this.formControl!.updateValueAndValidity();
    })
  }

  ngAfterViewInit(): void {
    if (this.autofocus()){
      this.inputElement.nativeElement.focus();
    }
  }

  getErrorMessage(): string | null{
    if (!this.formControl.errors) return null;
    const errors = this.formControl.errors ?? {};
    for (const key of Object.keys(errors)){
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'minlength':
          return `Minimum length required is ${errors[key].requiredLength} characters`
        case 'email':
          return 'It must be a valid email'
        case 'patternInvalid':
          return 'Invalid pattern'
      }
    }
  }

  showPassword = signal<boolean>(false);
  inputType = computed(()=>{
    if (this.type() !== 'password') return this.type();
    return this.showPassword() ? 'text' : 'password'
  })
  eyeIcon = computed(() =>
    this.showPassword() ? 'visibility' : 'visibility_off'
  );

  togglePassword() {
    this.showPassword.update(prev => !prev);
  }
}