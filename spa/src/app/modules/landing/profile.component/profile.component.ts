import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'profile-page',
  imports: [],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent { }
