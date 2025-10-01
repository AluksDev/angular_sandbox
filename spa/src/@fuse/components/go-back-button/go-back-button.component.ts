import { Component, inject, input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { SubscriptionLike } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'go-back-button',

  imports: [MatIcon, MatIconButton],
  templateUrl: './go-back-button.component.html',
})
export class GoBackButtonComponent implements OnDestroy {
  private location = inject(Location);

  protected subcription$: SubscriptionLike;
  parent: string = null;
  justOneStep = input(true);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.subcription$ = this.location.subscribe((val) => {
      if (this.parent) {
        let current = val.url.split(';')[0];
        current = current.split('#')[0];
        if (current !== this.parent && current.startsWith(this.parent)) {
          this.location.back();
        } else {
          this.parent = null;
        }
      }
    });
  }

  goBack(): void {
    const path = this.location.path().split('/');
    path.pop();

    this.parent = '';
    if (!this.justOneStep()) {
      path.forEach((subpath) => {
        if (subpath !== '') {
          this.parent = this.parent + '/' + subpath;
        }
      });
    }
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subcription$.unsubscribe();
  }
}
