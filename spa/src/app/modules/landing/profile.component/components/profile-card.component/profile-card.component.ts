import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

import { User } from '@api/defs/User';
import { MatDivider } from "@angular/material/divider";
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AvatarComponent } from "../avatar.component/avatar.component";
// import { User } from '@app/core/user/user.types';

@Component({
  selector: 'profile-card',
  imports: [MatCardModule, MatIcon, MatDivider, DatePipe, TitleCasePipe, AvatarComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css',
})
export class ProfileCardComponent { 

  user = input.required<User>();

}
