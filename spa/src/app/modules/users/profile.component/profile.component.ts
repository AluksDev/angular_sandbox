import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';




import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileCardComponent } from '../components/profile-card.component/profile-card.component';
import { UserService } from '@app/services/user.service';


/**
 * ProfileComponent
 *
 * Displays the user's profile information using a reactive data resource.
 * Fetches user data via UserService and binds it reactively to the template.
 * Optimized with OnPush change detection.
 */
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
