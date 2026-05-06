import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, Injector, input, signal } from '@angular/core';
import { BaseFormControlAccessor } from '../../utils/control-value-accessor-base';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { ErrorMessages } from '../../error-messages';
import { MatInputModule } from '@angular/material/input';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form-textarea-component',
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatError, MatInputModule],
  templateUrl: './form-textarea-component.html',
  styleUrl: './form-textarea-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: FormTextareaComponent,
        multi: true
      }
    ]
})
export class FormTextareaComponent extends BaseFormControlAccessor { 
  label = input<string>();
  required = input<boolean>(false);
  placeholder = input<string>();
  hint = input<string>();
  appearance= input<string>('outline')
  maxLength = input<number>()
  minLength = input<number>();

  charCount = signal<number>(0)
  destroyRef = inject(DestroyRef);

  constructor(injector: Injector){
    super(injector);
    effect(() => {
      if (!this.formControl) return;

      this.formControl.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(
      value => {
          this.charCount.set(value.length);
        }
      )
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
      this.formControl!.setValidators(validators);
      this.formControl!.updateValueAndValidity();
    })
  }

  getErrorMessage(): string | null{
    if (!this.formControl.errors) return null;
    return ErrorMessages.getErrorMessage(this.formControl.errors);
  }
}
