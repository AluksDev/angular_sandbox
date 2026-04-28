import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { APIUser } from '@api/users/DTOs/user.interace';

@Component({
  selector: 'app-user-details-tabs',
  imports: [MatTabsModule, TitleCasePipe],
  templateUrl: './user-details-tabs.html',
  styleUrl: './user-details-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsTabs { 
  user = input<APIUser>();
}
