import { Component, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'landing-home',
  templateUrl: './home.component.html',

  imports: [MatCardModule, MatButtonModule, RouterLink],
  styles: [`
    .example-card {
      max-width: 400px;
    }

    .example-header-image {
      background-image: url('https://material.angular.dev/assets/img/examples/shiba1.jpg');
      background-size: cover;
    }
  `]
})
export class LandingHomeComponent {
  /**
   * Constructor
   */
  constructor() {}
}
