import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIUser } from '@api/users/DTOs/user.interace';
import { FormInputComponent } from "@app/shared/forms/components/form-input-component/form-input-component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe, Location } from '@angular/common';
import { FormSelectComponent } from "@app/shared/forms/components/form-select-component/form-select-component";
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { DepartmentsService } from '@app/core/services/departments.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from "@app/shared/components/message-dialog-component/message-dialog-component";
import { UserService } from '../../../../core/services/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@app/core/services/auth.service';
import { NotificationsService } from '@app/core/notifications/notification.service';

@Component({
  selector: 'app-edit-user-page',
  imports: [FormInputComponent, FormsModule, ReactiveFormsModule, DatePipe, FormSelectComponent, MatSlideToggleModule, MatButtonModule, MatTooltipModule, MatTooltip, MatProgressSpinnerModule],
  templateUrl: './edit-user-page.html',
  styleUrl: './edit-user-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserPage implements OnInit{
  notificationService = inject(NotificationsService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  departmentService = inject(DepartmentsService);
  location = inject(Location);
  userService = inject(UserService);
  readonly dialog = inject(MatDialog);
  authService = inject(AuthService);

  userDetails = signal<APIUser>(null);
  departmentsList = signal<{label: string, value: number}[]>([]);
  awaitingServer = signal<boolean>(false);
  currentUser = toSignal(this.authService.currentUser$);

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
        console.error(err)
      })
    })
    this.userForm.patchValue({
      first_name: this.userDetails().first_name,
      last_name: this.userDetails().last_name,
      username: this.userDetails().username,
      email: this.userDetails().email,
      department: this.userDetails().department,
      is_active: this.userDetails().is_active
    })
    this.userForm.markAsPristine();
  }

  userForm = this.fb.group({
    first_name: [''],
    last_name: [''],
    username: [{value: '', disabled: true}],
    email: [''],
    department: [null as number],
    is_active: [null as boolean]
  })

  onActiveToggleChange(event: MatSlideToggleChange){
    const status = event.checked;
    this.userForm.patchValue({
      is_active: status
    })
    this.userForm.get('is_active').markAsDirty();
  }

  openDialog(title: string, message: string, action: string): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {title: title, message: message, action: action}
    });
    dialogRef.afterClosed().subscribe((result)=> {
      if (!result) return;
      switch (result){
        case 'back':
          this.location.back()
          break;
        case 'continue':
          this.updateUser();
          break;
      }
  });
  }

  checkIfUnsavedChanges(){
    if (this.userForm.pristine) {
      this.location.back();
      return;
    }
    this.openDialog('Unsaved changes', 'You have unsaved changes that will be lost. Do you want to continue?', 'back');
  }

  checkIfDeactivatingUser(): void{
    if (this.userForm.get('is_active').dirty && this.userForm.get('is_active').value === false){
      this.openDialog('Changing user status', 'You are about to deactivate a user, continue?', 'continue');
    } else {
      this.updateUser();
    }
  }

  updateUser(){
    this.awaitingServer.set(true);
    this.userForm.disable();
    let data = {username: this.userForm.get('username').value};
    for (let control of Object.keys(this.userForm.controls)){
      if (this.userForm.get(control).dirty){
        data[control] = this.userForm.get(control).value;
      }
    }
    const userId = this.userDetails().id;
    this.userService.updateUser(userId, data).pipe(
      finalize(() => {
        this.awaitingServer.set(false);
        this.userForm.enable();
      })
    )
    .subscribe({
      next: (res => {
        this.notificationService.success('User updated')
        this.location.back();
      }),
      error: (err => {
        console.error(err);
        this.notificationService.error('Something went wrong');
      })
    })
  }
}
