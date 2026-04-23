import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { UserCreateDialogComponent } from "../../components/user-create-dialog-component/user-create-dialog-component";
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create-dialog-page',
  imports: [],
  templateUrl: './user-create-dialog-page.html',
  styleUrl: './user-create-dialog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreateDialogPage implements OnInit{
  private dialog = inject(MatDialog);
  router = inject(Router);
  ngOnInit(): void {
    const dialogRef = this.dialog.open(UserCreateDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(["/"]);
    })
  }
 }
