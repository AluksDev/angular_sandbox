import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@api/defs/User';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'user-row-actions',
  imports: [MatIconModule],
  templateUrl: './user-row-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRowActionsComponent { 

  userService = inject(UserService);

  user = input.required<User>();

  handleClick(){
    this.userService.toggleActive(this.user()).subscribe();
  }

}
