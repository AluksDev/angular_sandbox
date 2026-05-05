import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIUser } from '@api/users/DTOs/user.interace';
import { UserDetailsHeader } from "../../components/user-details-header/user-details-header";
import { UserDetailsTabs } from "../../components/user-details-tabs/user-details-tabs";
import { DepartmentsService } from '@app/services/departments.service';
import { Department } from '@api/departments/DTOs/department.interface';
import { BreadcrumbComponent } from "@app/shared/components/breadcrumb-component/breadcrumb-component";

@Component({
  selector: 'app-user-details-page',
  imports: [UserDetailsHeader, UserDetailsTabs, BreadcrumbComponent],
  templateUrl: './user-details-page.html',
  styleUrl: './user-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsPage implements OnInit{ 
  route = inject(ActivatedRoute);
  departmentsService = inject(DepartmentsService);

  userDetails = signal<APIUser>(null);
  departmentDetails = signal<Department>(null);

  fullName = computed(()=>{
    const user = this.userDetails();
    if (!user) return;
    const name = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
    return name || null;
  })

  ngOnInit(): void {
    this.userDetails.set(this.route.snapshot.data['userDetails']);
    if (!this.userDetails().department) return;
    this.departmentsService.getDepartmentById(this.userDetails().department).subscribe({
      next: ((res) => {
        this.departmentDetails.set(res);
      }),
      error: ((err) => {
        console.error(err);
      })
    })
  }
}
