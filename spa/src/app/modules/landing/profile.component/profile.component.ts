import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';


import { ProfileCardComponent } from "./components/profile-card.component/profile-card.component";
import { UserService } from '../user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@Component({
  selector: 'profile-page',
  imports: [ProfileCardComponent, MatProgressSpinnerModule],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent { 

  userService = inject(UserService)


  userResource = rxResource({
    loader: ({}) => {
      return this.userService.get();
    }
  })

}
