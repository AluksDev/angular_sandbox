import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIUser } from '@api/users/DTOs/user.interace';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { FormSelectComponent } from "@app/shared/forms/components/form-select-component/form-select-component";
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { DepartmentsService } from '@app/features/departments/departments.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Department } from '@api/departments/DTOs/department.interface';

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
  departmentService = inject(DepartmentsService);

  userDetails = signal<APIUser>(null);
  departmentsList = signal<{label: string, value: number}[]>([]);

  ngOnInit(): void {
    this.userDetails.set(this.route.snapshot.data['userDetails']);
    this.departmentService.getDepartments().subscribe({
      next: ((res) => {
        if (!res.results) throw new Error('No departments found');
        for (let dep of res.results){
          this.departmentsList.update((prev) => [...prev, {label: dep.name, value: dep.id}])
        }
      }),
      error: ((err) => {
        console.log(err)
      })
    })
    this.userForm.patchValue({
      first_name: this.userDetails().first_name,
      last_name: this.userDetails().last_name,
      username: this.userDetails().username,
      email: this.userDetails().email,
      department: this.userDetails().department
    })
    this.userForm.markAsPristine();
  }

  userForm = this.fb.group({
    first_name: [''],
    last_name: [''],
    username: [{value: '', disabled: true}],
    email: [''],
    department: [null as number]
  })

  onActiveToggleChange(event: MatSlideToggleChange){
    console.log(event)
  }
 }
