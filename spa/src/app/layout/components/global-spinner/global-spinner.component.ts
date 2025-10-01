import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GlobalSpinnerService } from './global-spinner.service';

@Component({
  selector: 'app-global-spinner',
  templateUrl: './global-spinner.component.html',
  imports: [MatProgressSpinnerModule],
  styleUrls: ['./global-spinner.component.scss'],
})
export class GlobalSpinnerComponent implements OnInit, OnDestroy {
  private globalSpinnerService = inject(GlobalSpinnerService);

  loading = false;
  loadingSubscription: Subscription;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.loadingSubscription = this.globalSpinnerService.loadingStatus.subscribe((value) => {
      this.loading = value;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }
}
