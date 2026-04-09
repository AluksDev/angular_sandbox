import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UsersListComponent } from '../../components/users-list-component/users-list-component';

@Component({
  selector: 'app-users-list-page',
  imports: [UsersListComponent],
  templateUrl: './users-list-page.html',
  styleUrl: './users-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListPage {}
