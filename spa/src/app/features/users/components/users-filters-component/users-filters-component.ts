import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { Department } from '@api/departments/DTOs/department.interface';
import { FormInputComponent } from '@app/shared/forms/components/form-input-component/form-input-component';
import { FormSelectComponent } from '@app/shared/forms/components/form-select-component/form-select-component';
import { debounceTime, filter, skip } from 'rxjs';

type FilterValues = {
  search?: string;
  department?: number | null;
  status?: string;
};

@Component({
  selector: 'app-users-filters-component',
  imports: [ReactiveFormsModule, FormInputComponent, FormSelectComponent, MatChipsModule],
  templateUrl: './users-filters-component.html',
  styleUrl: './users-filters-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class UsersFiltersComponent implements OnInit{
  departments = input<Department[]>();
  filterChange = output<FilterValues>();

  depSelectOptions = computed(() => {
    return this.departments().map(d => {
      return {
        label: d.name,
        value: d.id
      }
    })
  })
  
  activeFilters = computed(() => {
    const { search, status, department } = this.formValue();
    return [
      search && { label: `Search: ${search}`, key: 'search' },
      status && status!== 'all' && { label: `Status: ${status}`, key: 'status' },
      department && { label: `Department: ${this.getDepartmentName(department)}`, key: 'department' }
    ].filter(Boolean);
  });

  getDepartmentName(id: number): string {
    return this.depSelectOptions().find(dep => dep.value === id)?.label ?? '';
  }
  
  fb = inject(FormBuilder);
  filterForm = this.fb.group({
    search: [''],
    department: [null as number | null],
    status: [''],
  })

  formValue = toSignal(this.filterForm.valueChanges, {
    initialValue: this.filterForm.value
  });
  route = inject(ActivatedRoute);
  constructor(){
    const params = this.route.snapshot.queryParamMap;
    const rawStatus = params.get('status');

    let status = '';
    if (rawStatus === 'true') {
      status = 'active';
    } else if (rawStatus === 'false') {
      status = 'inactive';
    }
    const initialFilters: FilterValues = {
      search: params.get('search') || '',
      department: Number(params.get('department')),
      status: status
    }
    this.filterForm.patchValue(initialFilters);
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        skip(1),
        filter(values => {
          const dep = values.department;
          return !dep || this.depSelectOptions().some(opt => opt.value === dep);  //only let this value through if the department field is empty, or if it matches a real department ID
        })
      )
      .subscribe(values => {
        this.filterChange.emit(values)
      })
  }
  removeFilter(key: string) {
    if (key === 'search') {
      this.filterForm.patchValue({ search: '' });
    } else if (key === 'department') {
      this.filterForm.patchValue({ department: null });
    } else if (key === 'status') {
      this.filterForm.patchValue({ status: '' });
    }
  }
 }
