import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar-component',
  imports: [],
  templateUrl: './avatar-component.html',
  styleUrl: './avatar-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  initials = input<string>();
  color = input<string>();
 }
