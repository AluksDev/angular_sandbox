import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'landing-home',
  templateUrl: './home.component.html',

  imports: [MatButtonModule, MatIconModule, RouterLink],
})
export class LandingHomeComponent {
  /**
   * Constructor
   */
  constructor() {}
}
