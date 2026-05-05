import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { PasswordGeneratorComponent } from "@app/shared/components/password-generator-component/password-generator-component";
import { DepartmentsService } from '@app/services/departments.service';
import { FormSelectComponent } from "@app/shared/forms/components/form-select-component/form-select-component";
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { CustomValidators } from '@app/shared/forms/custom-validators';
import { UserService } from '@app/services/user.service';
import { Router } from '@angular/router';
import { NotificationsService } from '@app/core/notifications/notification.service';

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
  notificationService = inject(NotificationsService);
  dialogRef = inject(MatDialogRef<UserCreateDialogComponent>)
  departmentService = inject(DepartmentsService);
  userService = inject(UserService);
  router = inject(Router);
  fb = inject(FormBuilder);

  createUser = this.fb.group(
    {
      username: [''],
      email: [''],
      password: [''],
      password_confirm: [''],
      first_name: [''],
      last_name: [''],
      department: [null as number | null],
      roles: [null as string | null],
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
    const userData = {
      ...this.createUser.getRawValue(),
      roles: this.createUser.value.roles === 'user' ? [] : [this.createUser.value.roles]
    };
    this.userService.createUser(userData).subscribe({
      next: (user) => {
        this.notificationService.success(`Created user with id: ${user.id}`);
        this.dialogRef.close();
        this.router.navigate(['/dashboard']);
      },
      error: (err => {
        console.error(err.error);
        if (err.error?.username) {
          const message = err.error.username[0];
          this.notificationService.error(message);
        }
        if (err.error?.email) {
          const message = err.error?.email[0];
          this.notificationService.error(message);
        }
      })
    })
  }
}
