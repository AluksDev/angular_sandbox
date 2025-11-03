import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentUpdate } from '@api/defs/Department';
import { FormUtils } from '@utils/form-utils';

const ALPHANUMERIC_STRING = '^[a-zA-Z0-9]+$';

@Component({
  selector: 'department-form',
  imports: [ReactiveFormsModule],
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.css'
})
export class DepartmentFormComponent implements OnInit { 

  private fb = inject(FormBuilder);

  formUtils = FormUtils;

  department = input<DepartmentUpdate>(null);

  departmentForm: FormGroup;

  ngOnInit(){
    this.departmentForm = this.fb.group({
      name: [this.department()?.name ?? '', [Validators.required, Validators.minLength(2) , Validators.maxLength(255) ]],
      code: [this.department()?.code ?? '', [Validators.maxLength(50), Validators.pattern(ALPHANUMERIC_STRING) ]]
    })
    
  }


}
