import { Component, effect, inject, signal } from '@angular/core';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from '@app/core/auth/services/auth.service';
import { NgOptimizedImage } from '@angular/common';
import { FormUtils } from '@utils/form-utils';


/**
 * Component that displays and manages the login form.
 */
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
export class AuthSignInComponent{
  private _activatedRoute = inject(ActivatedRoute);
  private _authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);


  formUtils = FormUtils;


  /**
   * Object representing the alert displayed in the UI.
   *
   * @property type - The type of alert shown (`'success'`, `'error'`, `'info'`, etc.).
   * @property message - The message displayed inside the alert.
   */
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };

  /**
   * ReactiveForm to sign in
   */
  signInForm = this._formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],

  });

  isLoading = signal<boolean>(false);

  showAlert = signal<boolean>(false);

  disableFormEffect = effect(() => {
    this.isLoading() ? this.signInForm.disable() : this.signInForm.enable();
  })

  /** Inserted by Angular inject() migration for backwards compatibility */
  // constructor(...args: unknown[]);

  /**
   * Constructor
   */
  // constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   *  Checks if the user's session has expired by inspecting the URL query parameters.
   */
  // ngOnInit(): void {

  //   const params = this._activatedRoute.snapshot.queryParams;

  //   if (params['reason'] == 'expired') {
      
  //     this.handleAlert("Sesion expirada");
  //   }

    
    
  // }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Handles the form submission event.
   * Validates the form data, and if it is valid,
   * calls the authentication service to attempt a login.
   * @returns 
   */

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

  /**
   * Displays an alert with a custom message to the user.
   * @param error - The text message that will appear on the screen.
   */

  handleAlert(error: string) {
    this.showAlert.set(true);

    this.alert.type = 'error';
    this.alert.message = error;

    setTimeout(() => {
      this.showAlert.set(false);
    }, 5000);
  }

}
