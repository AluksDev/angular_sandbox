import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TimetablePrice } from '@api/model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-timetable-price-dialog',
  templateUrl: './timetable-price-dialog.component.html',
  styleUrls: ['./timetable-price-dialog.component.scss'],

  imports: [ReactiveFormsModule, MatInputModule, QuillModule, MatButtonModule, MatDialogModule],
})
export class TimetablePriceDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<TimetablePriceDialogComponent>>(MatDialogRef);
  private formBuilder = inject(FormBuilder);
  price = inject<TimetablePrice | null>(MAT_DIALOG_DATA);

  public form: FormGroup;
  public wysiwygConfig = {};

  private initial_autoalias = '';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.wysiwygConfig = {
      toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']],
      clipboard: {
        matchVisual: false,
      },
    };

    this.form = this.formBuilder.group({
      id: -1,
      alias: '',
      minPrice: null,
      maxPrice: null,
    });

    if (this.price) {
      this.form.patchValue({
        id: this.price.id,
        alias: this.price.text,
        minPrice: this.price.min_price,
        maxPrice: this.price.max_price,
      });

      this.initial_autoalias = this.calculateAutoAlias();
      this.form.patchValue({
        alias: this.form.value.alias.replace(this.initial_autoalias, ''),
      });
    }
  }

  calculateAutoAlias(): string {
    if (
      (this.form.value.minPrice === null || this.form.value.minPrice === '') &&
      (this.form.value.maxPrice === null || this.form.value.maxPrice === '')
    ) {
      return '';
    }
    if (this.form.value.maxPrice === null || this.form.value.maxPrice === '') {
      this.form.patchValue({ maxPrice: this.form.value.minPrice });
    }
    if (
      this.form.value.minPrice !== null &&
      this.form.value.minPrice !== '' &&
      this.form.value.maxPrice !== null &&
      this.form.value.maxPrice !== ''
    ) {
      if (this.form.value.minPrice > this.form.value.maxPrice) {
        this.form.patchValue({ maxPrice: this.form.value.minPrice });
      }
      if (
        this.form.value.minPrice === this.form.value.maxPrice &&
        (this.form.value.maxPrice === 0 || this.form.value.maxPrice === '0')
      ) {
        return 'Entrada Gratuïta';
      } else if (this.form.value.minPrice === this.form.value.maxPrice) {
        return 'Entrada general: ' + this.form.value.minPrice + ' €';
      } else {
        return 'Entrada general de: ' + this.form.value.minPrice + ' a ' + this.form.value.maxPrice + ' €';
      }
    } else if (this.form.value.minPrice === null || this.form.value.minPrice === '') {
      return 'Entrada general fins a ' + this.form.value.maxPrice + ' €';
    } else if (this.form.value.maxPrice === null || this.form.value.maxPrice === '') {
      return 'Entrada general desde ' + this.form.value.minPrice + ' €';
    } else {
      return '';
    }
  }

  isFormFilled(): boolean {
    return (
      (this.form.value.minPrice !== null && this.form.value.minPrice !== '') ||
      (this.form.value.maxPrice !== null && this.form.value.maxPrice !== '') ||
      (this.form.value.alias !== null && this.form.value.alias !== '')
    );
  }

  closeDialog(): void {
    let alias = this.calculateAutoAlias();
    if (this.form.value.alias) {
      alias += ' ' + this.form.value.alias;
    }

    this.dialogRef.close({
      id: this.form.value.id,
      front_id: this.form.value.id,
      text: alias,
      min_price: this.form.value.minPrice,
      max_price: this.form.value.maxPrice,
    });
  }
}
