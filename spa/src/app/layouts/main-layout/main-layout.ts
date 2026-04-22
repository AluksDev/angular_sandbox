import {Component, inject, signal} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { FuseNavigationItem, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { CdkTableModule } from "@angular/cdk/table";
import { UserSidebarSnippetComponent } from "@app/core/user/components/user-sidebar-snippet-component/user-sidebar-snippet-component";
import { AuthService } from '@app/core/auth/auth.service';
import { finalize, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe, NgIf } from '@angular/common';
import { mapApiUserToUser } from '@app/core/user/user.mapper';

@Component({
  selector: 'app-main-layout',
  imports: [MatSidenavModule, FuseVerticalNavigationComponent, RouterOutlet, CdkTableModule, UserSidebarSnippetComponent, AsyncPipe, NgIf],
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

  authService = inject(AuthService);
  user$ = this.authService.currentUser$.pipe(
    map(user => {
      if (!user) return null;
      return mapApiUserToUser(user)
    })
  );
  router = inject(Router);
  loading = signal<boolean>(false);
  _snackBar = inject(MatSnackBar);

  onUserAction(action: string){
    switch(action){
      case 'logout':
        this.logout();
    }
  }

   logout(){
    this.loading.set(true);
    this.authService.logout()
    .pipe(
      finalize(()=> this.loading.set(false))
    )
    .subscribe({
      next: ((res) => {
        this.openSnackBar(res.detail, 'Close');
        this.router.navigate(['/auth/login']);
      }),
      error: ()=>{
        this.openSnackBar('Something went wrong', 'Close');
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
 }
