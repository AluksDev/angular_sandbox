import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from '@app/core/auth/services/auth.service';
import { NgOptimizedImage } from '@angular/common';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
  animations: fuseAnimations,

  imports: [
    RouterLink,
    FuseAlertComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
  ],
})
export class AuthSignInComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);


  formUtils = FormUtils;


  // @ViewChild('signInNgForm') signInNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };

  signInForm = this._formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],

  });

  isLoading = signal<boolean>(false);
  showAlert = signal<boolean>(false);

  /** Inserted by Angular inject() migration for backwards compatibility */
  // constructor(...args: unknown[]);

  /**
   * Constructor
   */
  // constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------


  onSubmit() {

    this.isLoading.set(true);
    this.signInForm.markAllAsTouched();

    if ( this.signInForm.invalid) {
      this.handleAlert("Revise los campos");
      return;
    }

    const { username= '', password = '' } = this.signInForm.value;

    this._authService.login(username!, password!).subscribe( (resp) => {
      this.isLoading.set(false);


      if( resp.success) {
        this._router.navigateByUrl('/dashboard');
        return;
      }


      this.handleAlert(resp.message);
    });
  }

  handleAlert(error: string) {
    this.showAlert.set(true);

    //TODO  revisar que enseñamos
    this.alert.type = 'error';
    this.alert.message = error;

    /*
    Credenciales incorrectas → "Usuario o contraseña incorrectos"

    Usuario inactivo → "Tu cuenta está desactivada. Contacta al administrador"

    Sin conexión → "No se pudo conectar con el servidor. Intenta nuevamente"

    Campos vacíos → Mostrar mensaje específico por campo

    */

    setTimeout(() => {
      this.showAlert.set(false);
    }, 2000);
  }

}
