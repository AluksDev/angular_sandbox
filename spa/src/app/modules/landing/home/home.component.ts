import { Component, inject, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from "@angular/router";
import { UserCreateDialogComponent } from '@app/features/admin/components/user-create-dialog-component/user-create-dialog-component';

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
  
}
