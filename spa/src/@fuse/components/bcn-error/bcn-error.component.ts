import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-bcn-error',
  templateUrl: './bcn-error.component.html',

  imports: [],
  styleUrls: ['./bcn-error.component.scss'],
})
export class BCNErrorComponent {
  control = input<AbstractControl>();
  serverErrors = input<string[]>();
  frontErrors = input<string[]>();

  requiredText = input('Aquest camp és obligatori');

  constructor() {}
}
