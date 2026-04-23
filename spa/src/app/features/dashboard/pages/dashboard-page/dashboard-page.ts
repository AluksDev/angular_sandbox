import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { Router } from "@angular/router";
import { AuthService } from '@app/core/auth/auth.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatButtonModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  router = inject(Router);
  authService = inject(AuthService);
  user = toSignal(this.authService.currentUser$);

  isAdmin = computed(() => {
    const user = this.user();
    return !!user && (
      user.roles.includes('admin') ||
      user.roles.includes('superuser')
    );
  });

  openCreateUserDialog() {
    this.router.navigate(['/admin/users/create']);
  }
 }
