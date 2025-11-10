import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'form-error',
  imports: [],
  templateUrl: './form-error.component.html',
})
export class FormErrorComponent { 

  formUtils = FormUtils;

  control = input.required<FormGroup>();
  fieldName = input.required<string>();

}
