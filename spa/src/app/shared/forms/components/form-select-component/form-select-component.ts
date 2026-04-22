import { ChangeDetectionStrategy, Component, Injector, input, OnInit } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BaseFormControlAccessor } from '../../utils/control-value-accessor-base';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, of, startWith } from 'rxjs';
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
  label = input.required<string>();
  options = input.required<SelectOptions[]>()
  required = input<boolean>();
  placeholder= input<string>();
  searchable = input<boolean>();
  appearance = input<string>("outline")

  filteredOptions: Observable<any[]>;

  ngOnInit() {
  super.ngOnInit();

  if (!this.formControl) {
    console.error('FormControl not initialized');
    return;
  }
  if (this.searchable()) {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(this.formControl.value),
      map(value => {
        const displayValue = typeof value === 'string' ? value : '';
        return this.searchFilter(displayValue);
      })
    );
  }
}

  private searchFilter(value: string): SelectOptions[] {
    const filterValue = String(value).toLowerCase();
    return this.options().filter(option =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  displayWith(value: string): string {
    if (!value) return '';

    const option = this.options().find(opt => opt.value === value);
    return option ? option.label : '';
  }
}
