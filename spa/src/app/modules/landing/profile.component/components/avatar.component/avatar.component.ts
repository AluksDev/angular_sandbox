import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'user-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent { }
