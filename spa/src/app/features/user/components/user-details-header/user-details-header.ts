import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { AvatarComponent } from "../avatar-component/avatar-component";
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { AuthService } from '@app/core/services/auth.service';
import { APIUser } from '@api/users/DTOs/user.interace';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user-details-header',
  imports: [AvatarComponent, MatButtonModule, NgClass, RouterLink],
  templateUrl: './user-details-header.html',
  styleUrl: './user-details-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsHeader {
  authService = inject(AuthService);

  userId = input<number>();
  fullName = input<string>();
  username = input<string>();
  email = input<string>();
  is_active = input<boolean>();

  initials = computed(()=> {
    if (!this.fullName()) return;
    return this.fullName().split(' ').map(n => n[0]).join('');
  })

  currentUser = toSignal(this.authService.currentUser$);
  canEdit = computed(() => {
    const user = this.currentUser();
    const userId = this.userId();

    if (!user) return false;

    return (
      user.roles.includes('admin') ||
      user.roles.includes('superuser') ||
      user.id === userId
    );
  });
 }
