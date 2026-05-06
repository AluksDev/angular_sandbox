import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FormInputComponent } from '@app/shared/forms/components/form-input-component/form-input-component';
import { AuthService } from '../../../services/auth.service';
import { FormSelectComponent } from "@app/shared/forms/components/form-select-component/form-select-component";
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { DepartmentsService } from '@app/core/services/departments.service';
import { Department } from '@api/departments/DTOs/department.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap } from 'rxjs';
import { Router, RouterLink } from "@angular/router";
import { UserService } from '@app/core/services/user.service';
import { NotificationsService } from '@app/core/notifications/notification.service';
import { LoadingService } from '@app/core/services/loading.service';
import { AsyncPipe } from '@angular/common';
import { CustomValidators } from '@app/shared/forms/validators/custom-validators';
import { ErrorMessages } from '@app/shared/forms/error-messages';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-register-page',
  imports: [
    FormInputComponent, 
    ReactiveFormsModule, 
    MatButtonModule, 
    FormSelectComponent, 
    MatStepperModule, 
    MatProgressSpinnerModule, 
    RouterLink,
    AsyncPipe,
    MatError,
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage{
  authService = inject(AuthService);
  departmentService = inject(DepartmentsService);
  userService = inject(UserService);
  router = inject(Router);
  passwordPattern = '^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$';
  departmentList = signal<Department[]>([]);
  departmentOptions = computed(() =>
  this.departmentList().map(dep => ({
    label: dep.name,
    value: dep.id
  }))
);
  hasRegistered = signal<boolean>(false);
  loadingService = inject(LoadingService);
  loading$ = this.loadingService.loading$;
  stepper = viewChild<MatStepper>('stepper'); 
  notificationService = inject(NotificationsService);

  hasCompletedRegistration = (formGroup: AbstractControl) => {
    if (this.hasRegistered()){
      return null;
    } else {
      return { incompleteRegistration: true }
    }
  }

  fb = inject(FormBuilder);
  registerForm = this.fb.group({
    formArray: this.fb.array([
      this.fb.group({
        username: [''],
        email: [''],
        first_name: [''],
        last_name: ['']
      }),
      this.fb.group({
        password: [''],
        password_confirm: ['']
      }, 
      { 
        validators: [CustomValidators.passwordMatchValidator(), this.hasCompletedRegistration],
        updateOn: 'blur'
      }
      ),
      this.fb.group({
        department: ['']
      })
    ])
  });

  get formArray() {
    return this.registerForm.get('formArray') as FormArray;
  }

  checkPasswordsErrorMessage() {
    return ErrorMessages.getErrorMessage(this.formArray.at(1).errors);
  }

  registerUser(){
    const dataGroup = this.formArray.at(0);
    const pswGroup = this.formArray.at(1);
    if (pswGroup.get('password').invalid || pswGroup.get('password_confirm').invalid || dataGroup.invalid) return;
    const userData = dataGroup.value;
    const pswData = pswGroup.value;
    const formData = {...userData, ...pswData};
    const stepper = this.stepper();
    this.authService.registerUser(formData)
    .pipe(
      switchMap(() => this.departmentService.getDepartments()),
    )
    .subscribe({
      next: ((res)=>{
        this.departmentList.set(res.results);
        this.formArray.at(0).disable();
        this.formArray.at(1).disable();
        this.hasRegistered.set(true);
        if (stepper) {
          stepper.selectedIndex = 2;
        }
      }),
      error: ((err)=>{
        console.error(err);
        const errorMsg = err.error.username || err.error.password || 'Something went wrong';
        this.notificationService.error(errorMsg);
        pswGroup.reset();
      })
    });
  }

  assignDepartment(){
    if (this.formArray.at(2).invalid || this.formArray.at(2).get('department').value === '') return;
    const departmentId = parseInt(this.formArray.at(2).get('department').value);
    this.userService.assignDepartmentToCurrentUser(departmentId).subscribe({
      next: ((res) => {
        this.router.navigate(['/']);
      }),
      error: ((err) => {
        console.error(err);
        this.notificationService.error('Failed to assign department. Please try again.');
      })
    })
  }
}
