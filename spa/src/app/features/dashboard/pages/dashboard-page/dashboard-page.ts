import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from "@angular/router";
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
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
