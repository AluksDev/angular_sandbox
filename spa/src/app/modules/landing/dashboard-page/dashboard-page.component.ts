import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@app/core/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent { 

  authService = inject(AuthService); 


}


export default DashboardPageComponent;