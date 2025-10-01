import { Component, inject } from '@angular/core';
import { UserCurrentFormService } from '@api/forms/user/current/current.service';
import { User } from '@api/model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from '@utils/components/custom-select/custom-select.component';

@Component({
  selector: 'app-priority-dialog',
  templateUrl: './priority-dialog.component.html',

  imports: [MatDialogModule, NgSelectModule, FormsModule, MatButtonModule, CommonModule, CustomSelectComponent],
  styleUrls: ['./priority-dialog.component.scss'],
})
export class PriorityDialogComponent {
  private userCurrentFormService = inject(UserCurrentFormService);
  dialogRef = inject<MatDialogRef<PriorityDialogComponent>>(MatDialogRef);

  user$: Observable<User>;
  form: FormGroup = new FormGroup({
    spendingCenter: new FormControl(null),
    translator_option: new FormControl(null, Validators.required),
  });
  translatorOptions: { translation_system: string }[];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.user$ = this.userCurrentFormService.submit({ expand: 'spending_centers' }).pipe(
      map((value: User): User => {
        this.form.get('spendingCenter').setValue(value.spending_centers?.length ? value.spending_centers[0] : null);
        return value;
      }),
    );
    this.translatorOptions = [{ translation_system: 'linguaserve' }, { translation_system: 'openai' }];
  }

  close(priority: string): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }
    this.dialogRef.close({
      priority: priority,
      spending_center: this.form.get('spendingCenter').value,
      translator_option: this.form.get('translator_option').value,
    });
  }
}
