import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIUser } from '@api/users/DTOs/user.interace';

@Component({
  selector: 'app-user-details-page',
  imports: [],
  templateUrl: './user-details-page.html',
  styleUrl: './user-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsPage implements OnInit{ 
  route = inject(ActivatedRoute);

  userDetails = signal<APIUser>(null);

  ngOnInit(): void {
    this.userDetails.set(this.route.snapshot.data['userDetails']);
    console.log(this.userDetails())
  }
}
