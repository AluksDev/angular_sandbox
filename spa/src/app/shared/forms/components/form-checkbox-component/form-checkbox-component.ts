import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-form-checkbox-component',
  imports: [MatCheckbox],
  templateUrl: './form-checkbox-component.html',
  styleUrl: './form-checkbox-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCheckboxComponent { 
  label = input.required<string>();
  isDisabled = input<boolean>();
  isRequired = input<boolean>();
}
