import { ChangeDetectionStrategy, Component, effect, Injector, input, OnInit } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlAccessor } from '../../utils/control-value-accessor-base';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ErrorMessages } from '../../error-messages';

interface SelectOptions {
  label: string,
  value: string
}

@Component({
  selector: 'app-form-select-component',
  imports: [ReactiveFormsModule, MatAutocompleteModule, AsyncPipe, MatInputModule, MatFormFieldModule, FormsModule, MatSelectModule],
  templateUrl: './form-select-component.html',
  styleUrl: './form-select-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
   providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormSelectComponent,
      multi: true
    }
  ]
})
export class FormSelectComponent extends BaseFormControlAccessor{
  label = input<string>();
  options = input<SelectOptions[]>()
  required = input<boolean>();
  placeholder= input<string>();
  searchable = input<boolean>();
  appearance = input<string>("outline")
  dataCy = input<string>();

  filteredOptions: Observable<SelectOptions[]>;
  constructor(injector: Injector) {
    super(injector);

    effect(() => {
      if (!this.formControl || !this.searchable()) return;
      
      const currentOptions = this.options() ?? [];

      this.filteredOptions = this.formControl.valueChanges.pipe(
        startWith(this.formControl.value),
        map(value => {
          const isStoredId = currentOptions.some(opt => opt.value === value);
          if (isStoredId) return currentOptions;
          const typed = typeof value === 'string' ? value : '';
          return currentOptions.filter(opt =>
            opt.label.toLowerCase().includes(typed.toLowerCase())
          );
        })
      );
    });
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.formControl) {
      console.error('FormControl not initialized');
      return;
    }
    const validators = [];
    if (this.required()){
      validators.push(Validators.required);
    }
    this.formControl!.setValidators(validators);
    this.formControl!.updateValueAndValidity();
  }

  getErrorMessage(): string | null{
    if (!this.formControl.errors) return null;
    ErrorMessages.getErrorMessage(this.formControl.errors);
  }

  private searchFilter(value: string): SelectOptions[] {
    const filterValue = String(value).toLowerCase();
    return this.options().filter(option =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  displayWith = (value: string): string => {
    if (!value) return '';

    const option = this.options().find(opt => opt.value === value);
    return option ? option.label : '';
  }
}
