import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';
import { DialogComponent } from '../dialog.component/dialog.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatProgressSpinnerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent { 

  private _router = inject(Router);
  private _dialog = inject(MatDialog)
  authService = inject(AuthService); 

  isLoading = signal(false);

  logout(){

    this.isLoading.set(true);

    this.authService.logout().subscribe( (resp) => {
      this.isLoading.set(false);

      if( resp.success) {
        this._dialog.open(DialogComponent, {
          width: '350px',
          data: {
            title: '¡Sesión cerrada!',
            success: true,
            message: 'Sesión cerrada correctamente'
          }
        });

        this._router.navigateByUrl('/auth/sign-in');
        return;
      }
    });
  }

}
