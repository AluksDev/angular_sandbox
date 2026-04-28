import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AvatarComponent } from "../avatar-component/avatar-component";
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-details-header',
  imports: [AvatarComponent, MatButtonModule, NgClass],
  templateUrl: './user-details-header.html',
  styleUrl: './user-details-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsHeader {
  userId = input<number>();
  fullName = input<string>();
  username = input<string>();
  email = input<string>();
  is_active = input<boolean>();

  initials = computed(()=> {
    if (!this.fullName()) return;
    return this.fullName().split(' ').map(n => n[0]).join('');
  })
 }
