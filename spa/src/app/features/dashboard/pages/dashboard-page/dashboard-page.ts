import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserCreateDialogComponent } from '@app/features/admin/components/user-create-dialog-component/user-create-dialog-component';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  router = inject(Router);
  openCreateUserDialog() {
    this.router.navigate(['/admin/users/create']);
  }
 }
