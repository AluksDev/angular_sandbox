import { ChangeDetectionStrategy, Component, effect, Injector, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormControlAccessor } from '../../utils/control-value-accessor-base';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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

  filteredOptions: Observable<SelectOptions[]>;
  constructor(injector: Injector) {
    super(injector);
    
    effect(() => {
      if (!this.formControl || !this.searchable()) return;
      const currentOptions = this.options();
      this.filteredOptions = this.formControl.valueChanges.pipe(
        startWith(currentOptions),
        map(value => {
          const displayValue = typeof value === 'string' ? value : '';
          return this.searchFilter(displayValue);
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
    const errors = this.formControl.errors ?? {};
    for (const key of Object.keys(errors)){
      switch (key) {
        case 'required':
          return 'This field is required';
      }
    }
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
