import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',

  imports: [MatProgressSpinner],
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerDialogComponent {
  constructor() {}
}
