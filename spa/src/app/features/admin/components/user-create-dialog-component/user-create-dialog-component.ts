import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { PasswordGeneratorComponent } from "@app/shared/components/password-generator-component/password-generator-component";
import { DepartmentsService } from '@app/features/departments/departments.service';
import { FormSelectComponent } from "@app/shared/forms/components/form-select-component/form-select-component";
import { AsyncPipe, JsonPipe } from '@angular/common';
import { map } from 'rxjs';
import { CustomValidators } from '@app/shared/forms/custom-validators';
import { MatError } from "@angular/material/form-field";

@Component({
  selector: 'app-user-create-dialog-component',
  imports: [
    MatDialogModule, 
    FormInputComponent, 
    ReactiveFormsModule, 
    FormsModule, 
    MatButtonModule, 
    PasswordGeneratorComponent, 
    FormSelectComponent, 
    AsyncPipe
  ],
  templateUrl: './user-create-dialog-component.html',
  styleUrl: './user-create-dialog-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreateDialogComponent { 
  departmentService = inject(DepartmentsService);
  fb = inject(FormBuilder);
  createUser = this.fb.group(
    {
      username: [''],
      email: [''],
      password: [''],
      password_confirm: [''],
      first_name: [''],
      last_name: [''],
      department: [''],
      roles: [''],
    },
    {
      validators: CustomValidators.passwordMatchValidator()
    }
  )

  passwordPattern = '^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$';

  departments$ = this.departmentService.getDepartments().pipe(
    map(result => {
      return result.results.map( dep => {
        return {
          label: dep.name,
          value: dep.id
        }
      })
    })
  );

  onSubmit(){
    this.createUser.markAllAsTouched();
    if (this.createUser.invalid) return;
    console.log("Form Data: ", this.createUser.getRawValue())
  }
}
