import { ChangeDetectionStrategy, Component, Injector, input, OnInit } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BaseFormControlAccessor } from '../../utils/control-value-accessor-base';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
  options = input.required<string[]>()
  required = input<boolean>();
  placeholder= input<string>();
  searchable = input<boolean>();

  formControl: FormControl;

  filteredOptions: Observable<string[]>;

  ngOnInit() {
    super.ngOnInit(); 
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options().filter(option => option.toLowerCase().includes(filterValue));
  }
}
