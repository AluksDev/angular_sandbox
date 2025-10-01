import { Component, input } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { of } from 'rxjs';

@Component({
  selector: 'app-fake-loading',
  templateUrl: './fake-loading.component.html',
  styleUrls: ['./fake-loading.component.scss'],
  imports: [NgxSkeletonLoaderModule],
})
export class FakeLoadingComponent {
  type = input<string>();

  constructor() {}

  protected readonly of = of;
}
