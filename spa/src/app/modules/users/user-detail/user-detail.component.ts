import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { rxResource } from '@angular/core/rxjs-interop';

import { ActivatedRoute } from '@angular/router';
import { ProfileCardComponent } from '../components/profile-card.component/profile-card.component';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'user-detail',
  imports: [ProfileCardComponent, MatProgressSpinnerModule],
  templateUrl: './user-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserDetailComponent { 

  userService = inject(UserService);
  route = inject(ActivatedRoute);
  
  
  userResource = rxResource({
    loader: ({}) => {

      const id = this.route.snapshot.params['id'];
      
      return this.userService.getUserById(id);
    }
  })

}
