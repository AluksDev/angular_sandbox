import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from "@angular/router";
import { AuthService } from '@app/core/services/auth.service';
import { DepartmentsService } from '@app/core/services/departments.service';
import { UsersService } from '@app/core/services/users.service';
import { forkJoin, map, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit{
  router = inject(Router);
  authService = inject(AuthService);
  usersService = inject(UsersService);
  departmentsService = inject(DepartmentsService);

  user = toSignal(this.authService.currentUser$);
  totalUsers = signal<number>(0);
  activeUsers = signal<number>(0);
  totalDepartments = signal<number>(0);

  isAdmin = computed(() => {
    const user = this.user();
    return !!user && (
      user.roles.includes('admin') ||
      user.roles.includes('superuser')
    );
  });

  ngOnInit(): void {
    forkJoin({
      total: this.usersService.getAllUsers(),
      active: this.usersService.getAllUsers({ is_active: 'true' }),
      departments: this.departmentsService.getDepartments()
    })
    .subscribe(({ total, active, departments }) => {
      this.totalUsers.set(total.count);
      this.activeUsers.set(active.count);
      this.totalDepartments.set(departments.count);
    });
  }

  openCreateUserDialog() {
    this.router.navigate(['/admin/users/create']);
  }
 }
