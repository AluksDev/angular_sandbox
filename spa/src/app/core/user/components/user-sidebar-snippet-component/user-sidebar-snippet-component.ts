import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '@api/users/DTOs/user.interace';

@Component({
  selector: 'app-user-sidebar-snippet-component',
  imports: [MatMenuModule, MatIconModule, JsonPipe],
  templateUrl: './user-sidebar-snippet-component.html',
  styleUrl: './user-sidebar-snippet-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSidebarSnippetComponent {
  user = input.required<User>();
  action = output<string>();

  onAction(action: string){
    this.action.emit(action)
  }

 }
