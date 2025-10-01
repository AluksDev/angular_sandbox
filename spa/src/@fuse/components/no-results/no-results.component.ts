import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',

  imports: [MatIcon],
  styleUrls: ['./no-results.component.scss'],
})
export class NoResultsComponent {
  messageType = input('big'); // big, medium or small

  constructor() {}
}
