import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { FormInputComponent } from '@app/shared/forms/components/form-input-component/form-input-component';
import { FormSelectComponent } from '@app/shared/forms/components/form-select-component/form-select-component';
import { Department } from '@app/shared/interfaces/department.interface';
import { debounceTime, Observable, startWith, switchMap, tap } from 'rxjs';

type FilterValues = {
  searchTerm?: string;
  department?: number | null;
  status?: string;
};

@Component({
  selector: 'app-users-filters-component',
  imports: [ReactiveFormsModule, FormInputComponent, FormSelectComponent, AsyncPipe, MatChipsModule],
  templateUrl: './users-filters-component.html',
  styleUrl: './users-filters-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class UsersFiltersComponent implements OnInit{
  departments$ = input.required<Observable<Department[]>>();
  filterChange = output<FilterValues>();
  
  activeFilters = computed(() => {
    const { searchTerm, status, department } = this.formValue();
    console.log('cmputing active filters')
    return [
      searchTerm && { label: `Search: ${searchTerm}`, key: 'searchTerm' },
      status && { label: `Status: ${status}`, key: 'status' },
      department && { label: `Department: ${department}`, key: 'department' }
    ].filter(Boolean);
  });
  
  fb = inject(FormBuilder);
    filterForm = this.fb.group({
      searchTerm: [''],
      department: [null as number | null],
      status: [''],
    })

    formValue = toSignal(this.filterForm.valueChanges, {
      initialValue: this.filterForm.value
    });

    ngOnInit() {
      this.filterForm.valueChanges
        .pipe(
          debounceTime(300),
          startWith(this.filterForm.value), 
        )
        .subscribe(values => {
          this.filterChange.emit(values)
        })
    }
    removeFilter(key: string) {
      if (key === 'searchTerm') {
        this.filterForm.patchValue({ searchTerm: '' });
      } else if (key === 'department') {
        this.filterForm.patchValue({ department: null });
      } else if (key === 'status') {
        this.filterForm.patchValue({ status: '' });
      }
    }
 }
