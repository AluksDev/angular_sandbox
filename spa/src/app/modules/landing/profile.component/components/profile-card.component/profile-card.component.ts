import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

import { User } from '@api/defs/User';
import { MatDivider } from "@angular/material/divider";
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AvatarComponent } from "../avatar.component/avatar.component";

/**
 * ProfileCardComponent
 *
 * A presentational component that displays basic user profile information,
 * including name, avatar, username, and other optional metadata.
 *
 * This component is meant to be used inside a profile page or dashboard
 * to visually represent a user.
*/
@Component({
  selector: 'profile-card',
  imports: [MatCardModule, MatIcon, MatDivider, DatePipe, TitleCasePipe, AvatarComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css',
})
export class ProfileCardComponent { 

  user = input.required<User>();

}
