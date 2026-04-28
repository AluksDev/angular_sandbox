import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIUser } from '@api/users/DTOs/user.interace';
import { UserDetailsHeader } from "../../components/user-details-header/user-details-header";
import { UserDetailsTabs } from "../../components/user-details-tabs/user-details-tabs";
import { DepartmentsService } from '@app/features/departments/departments.service';
import { Department } from '@api/departments/DTOs/department.interface';

@Component({
  selector: 'app-user-details-page',
  imports: [UserDetailsHeader, UserDetailsTabs],
  templateUrl: './user-details-page.html',
  styleUrl: './user-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsPage implements OnInit{ 
  route = inject(ActivatedRoute);
  departmentsService = inject(DepartmentsService);

  userDetails = signal<APIUser>(null);
  departmentDetails = signal<Department>(null);

  ngOnInit(): void {
    this.userDetails.set(this.route.snapshot.data['userDetails']);
    console.log(this.userDetails())
    this.departmentsService.getDepartmentById(this.userDetails().department).subscribe({
      next: ((res) => {
        this.departmentDetails.set(res);
      }),
      error: ((err) => {
        console.log(err);
      })
    })
  }
}
