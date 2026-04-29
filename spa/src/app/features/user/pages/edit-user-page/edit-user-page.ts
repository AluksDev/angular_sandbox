import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIUser } from '@api/users/DTOs/user.interace';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { FormSelectComponent } from "@app/shared/forms/components/form-select-component/form-select-component";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-edit-user-page',
  imports: [FormInputComponent, FormsModule, ReactiveFormsModule, DatePipe, FormSelectComponent, MatSlideToggleModule, MatButtonModule, MatTooltipModule, MatTooltip],
  templateUrl: './edit-user-page.html',
  styleUrl: './edit-user-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserPage implements OnInit{
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  userDetails = signal<APIUser>(null);

  ngOnInit(): void {
    this.userDetails.set(this.route.snapshot.data['userDetails']);
  }

  userForm = this.fb.group({
    first_name: [''],
    last_name: [''],
    username: [{value: '', disabled: true}],
    email: [''],
    department: ['']
  })
 }
