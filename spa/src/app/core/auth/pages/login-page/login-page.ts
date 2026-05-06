import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from "@angular/router";
import { NotificationsService } from '@app/core/notifications/notification.service';
import { LoadingService } from '@app/core/services/loading.service';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-login-page',
  imports: [FormInputComponent, FormsModule, ReactiveFormsModule, MatButtonModule, MatProgressSpinnerModule, RouterLink, AsyncPipe],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  notificationService = inject(NotificationsService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  loginForm = this.fb.group({
    username: [''],
    password: ['']
  })

  loadingService = inject(LoadingService);
  loading$ = this.loadingService.loading$;
  router = inject(Router);

  onSubmit() {
    this.loginForm.markAsTouched();
    if (this.loginForm.invalid) {
      this.notificationService.warning('Form invalid');
      return;
    };
    const data = this.loginForm.getRawValue();
    this.authService.loginUser(data).subscribe({
      next: () => {
        this.notificationService.success('Login Successful');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error("Error", err);
        this.notificationService.error(this.getErrorMessage(err));
        this.loginForm.reset();
      },
    })
  }
  getErrorMessage(error: any): string{
    if (error.status === 400){
      return 'Invalid username or password';
    }
    return 'Login failed. Please try again.';
  }
 }
