import { Component, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@api/defs/User';
import { AuthService } from '@app/core/auth/services/auth.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'user-actions',
  imports: [MatIconModule],
  templateUrl: './user-actions.component.html',
  styleUrl: './user-actions.component.css',
})
export class UserActionsComponent { 

  user = input.required<User>();

  authService = inject(AuthService);

  isMenuOpen = signal<boolean>(false);

  userService = inject(UserService);

  toggleMenu() {
    this.isMenuOpen.update( value => !value);
  }

  editar() {
    console.log('Navegando a la edición...');
    
    this.isMenuOpen.set(false);
  }

  desactivar() {
    this.userService.toggleActive(this.user()).subscribe();

    this.isMenuOpen.set(false);

  }

}
