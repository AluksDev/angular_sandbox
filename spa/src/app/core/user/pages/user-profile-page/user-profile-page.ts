import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileCardComponent } from "../../components/profile-card-component/profile-card-component";
import { AvatarComponent } from "../../components/avatar-component/avatar-component";
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@app/core/auth/auth.service';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { DepartmentsService } from '@app/core/departments/departments.service';

@Component({
  selector: 'app-user-profile-page',
  imports: [ProfileCardComponent, AvatarComponent, MatButtonModule, NgIf, AsyncPipe],
  templateUrl: './user-profile-page.html',
  styleUrl: './user-profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfilePage {
  authService = inject(AuthService);
  departmentService = inject(DepartmentsService);
  user$ = this.authService.currentUser$;

  allData$ = combineLatest([
    this.user$,
    this.user$.pipe(
      switchMap((user) => {
        if (!user) return of(null);
        return this.departmentService.getDepartmentById(user.department);
      })
    )
  ]).pipe(
    map(([user, department]) => {
      if (!user) return null;
      
      return {
        user,
        department: this.transformDepartment(department),
        userDetails: this.transformUserDetails(user),
        userStatus: this.transformUserStatus(user),
        userAvatarDetails: this.transformAvatarDetails(user)
      };
    })
  );

  private transformDepartment(dep: any) {
    if (!dep) {
      return [
        { title: 'Name', details: 'N/A' },
        { title: 'Code', details: 'N/A' }
      ];
    }
    return [
      { title: 'Name', details: dep.name ?? '' },
      { title: 'Code', details: dep.code ?? '' }
    ];
  }

  private transformUserDetails(user: any) {
    return [
      { title: 'Username', details: user.username },
      { title: 'First Name', details: user.first_name ? user.first_name : 'N/A' },
      { title: 'Last Name', details: user.last_name ? user.last_name : 'N/A' },
      { title: 'Email', details: user.email },
      { title: 'Roles', details: user.roles.join(', ') }
    ];
  }

  private transformUserStatus(user: any) {
    return [
      { title: 'Status', details: user.is_active ? 'Active' : 'Inactive' },
      { title: 'Date Joined', details: new Date(user.date_joined).toLocaleString('en-GB') },
      { title: 'Last Login', details: new Date(user.last_login).toLocaleString('en-GB') }
    ];
  }

  private transformAvatarDetails(user: any) {
    return {
      initials: this.userInitials(user.first_name, user.last_name),
      color: this.getAvatarColor(user.id)
    };
  }

  userInitials(firstName: string, lastName: string): string {
    return (firstName?.[0] ?? '$') + (lastName?.[0] ?? '$');
  }

  getAvatarColor(id: number): string {
    const hue = (id * 137) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  }
}
