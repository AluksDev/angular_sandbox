import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserCreateDialogComponent } from '@app/features/admin/components/user-create-dialog-component/user-create-dialog-component';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private dialog = inject(MatDialog);
  openCreateUserDialog() {
    const dialogRef = this.dialog.open(UserCreateDialogComponent);
  }
 }
