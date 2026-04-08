import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { FormInputComponent } from '@app/shared/forms/components/form-input-component/form-input-component';

@Component({
  selector: 'app-register-page',
  imports: [FormInputComponent, ReactiveFormsModule, JsonPipe, MatButtonModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage { 
  fb = inject(FormBuilder);
  registerForm = this.fb.group({
    username: ['',],
    email: ['',],
    password: ['',],
  })

    onSubmit(){
      this.registerForm.markAllAsTouched();
    }
}
