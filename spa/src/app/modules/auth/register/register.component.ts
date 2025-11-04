import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from '@app/core/auth/services/auth.service';
import { FormUtils } from '@utils/form-utils';
import { MatSelectModule } from '@angular/material/select';
import { DepartmentService } from '@modules/departments/department.service';
import { PasswordStrengthComponent } from './components/password-strength.component/password-strength.component';

@Component({
  selector: 'auth-sign-up',
  templateUrl: './register.component.html',
  animations: fuseAnimations,

  imports: [
    FuseAlertComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    PasswordStrengthComponent
  ],
})
export class AuthSignUpComponent{
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);
  departmentService = inject(DepartmentService);

  departmentResource = rxResource({
    loader: ({}) => {
      return this.departmentService.getDepartments('');
    }
  });

  formUtils = FormUtils;
  

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };

  showAlert = false;

  personalData = this._formBuilder.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],

  });

  passwordForm = this._formBuilder.group({
    password: ['', 
      [Validators.required, 
        Validators.minLength(8),
        Validators.pattern(FormUtils.uppercasePattern),
        Validators.pattern(FormUtils.numberPattern),
        Validators.pattern(FormUtils.specialPattern),
      ]],
    password_confirm: ['', 
      [Validators.required, 
        Validators.minLength(8),
        Validators.pattern(FormUtils.uppercasePattern),
        Validators.pattern(FormUtils.numberPattern),
        Validators.pattern(FormUtils.specialPattern),
      ]],

  },
  {
    validators : [
      this.formUtils.isFieldOneEqualFieldTwo('password', 'password_confirm'),
    ]
  }

);

  chooseDepartment = this._formBuilder.group({
    department: ['', Validators.required],
  });

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign up
   */
  signUp(): void {

    if (this.personalData.invalid || this.passwordForm.invalid || this.chooseDepartment.invalid) {
      return;
    }

    const personalData = this.personalData.value as { 
        username: string; 
        email: string; 
        first_name: string; 
        last_name: string; 
    };

    const passwordData = this.passwordForm.value as { 
        password: string; 
        password_confirm: string; 
    };

    const departmentData = this.chooseDepartment.value as { 
        department: string; 
    };

    this._authService.register({
        ...personalData,
        ...passwordData,
        department: +departmentData.department
    }).subscribe();
  }
}
