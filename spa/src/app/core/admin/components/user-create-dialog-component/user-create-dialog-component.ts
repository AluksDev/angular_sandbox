import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { PasswordGeneratorComponent } from "@app/shared/components/password-generator-component/password-generator-component";

@Component({
  selector: 'app-user-create-dialog-component',
  imports: [MatDialogModule, FormInputComponent, ReactiveFormsModule, FormsModule, MatButtonModule, PasswordGeneratorComponent],
  templateUrl: './user-create-dialog-component.html',
  styleUrl: './user-create-dialog-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreateDialogComponent { 
  fb = inject(FormBuilder);
  createUser = this.fb.group({
    username: [''],
    email: [''],
    password: [''],
    firstName: [''],
    lastName: [''],
    department: [''],
    role: [''],
  })

}
