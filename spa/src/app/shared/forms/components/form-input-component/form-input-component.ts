import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, Injector, input, signal, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlAccessor } from '../../utils/control-value-accessor-base';
import { MatIcon } from '@angular/material/icon';
import { PasswordStrengthComponent } from '../password-strength-component/password-strength-component';
import { ErrorMessages } from '../../error-messages';
import { CustomValidators } from '../../validators/custom-validators';

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
  dataCy = input<string>();

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
    return ErrorMessages.getErrorMessage(this.formControl.errors);
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