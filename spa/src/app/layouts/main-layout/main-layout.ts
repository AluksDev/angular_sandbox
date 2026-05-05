import {Component, inject, signal} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { CdkTableModule } from "@angular/cdk/table";
import { UserSidebarSnippetComponent } from "@app/features/user/components/user-sidebar-snippet-component/user-sidebar-snippet-component";
import { AuthService } from '@app/core/services/auth.service';
import { finalize, map } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { mapApiUserToUser } from '@app/features/user/user.mapper';
import { MatIcon } from "@angular/material/icon";
import { NotificationsService } from '@app/core/notifications/notification.service';

@Component({
  selector: 'app-main-layout',
  imports: [MatSidenavModule, FuseVerticalNavigationComponent, RouterOutlet, CdkTableModule, UserSidebarSnippetComponent, AsyncPipe, NgIf, RouterLink, MatIcon],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  navigationItems: FuseNavigationItem[] = [
    {
      type: 'basic',
      id: 'users',
      title: 'Users',
      link: '/users',
      icon: 'mat_outline:group'
    },
    {
      type: 'basic',
      id: 'departments',
      title: 'Departments',
      link: '/departments',
      icon: 'mat_outline:apartment'
    }
  ]
  private _fuseNavigationService = inject(FuseNavigationService);
  sideBarOpened = signal<boolean>(true);

  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
      this.sideBarOpened.set(navigation.opened());
    }
  }

  authService = inject(AuthService);
  user$ = this.authService.currentUser$.pipe(
    map(user => {
      if (!user) return null;
      return mapApiUserToUser(user)
    })
  );
  router = inject(Router);
  notificationService = inject(NotificationsService);

  onUserAction(action: string){
    switch(action){
      case 'logout':
        this.logout();
        break;
      case 'account':
        this.router.navigate(['/account']);
        break;
    }
  }

  logout(){
    this.authService.logout().subscribe({
      next: ((res) => {
        this.notificationService.info(res.detail);
        this.router.navigate(['/auth/login']);
      }),
      error: ()=>{
        this.notificationService.error('Something went wrong');
      }
    })
  }  
}
