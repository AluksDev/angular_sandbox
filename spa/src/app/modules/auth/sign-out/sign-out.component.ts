import { I18nPluralPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';

@Component({
  selector: 'auth-sign-out',
  templateUrl: './sign-out.component.html',

  imports: [RouterLink, I18nPluralPipe, NgOptimizedImage],
})
export class AuthSignOutComponent implements OnInit, OnDestroy {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  countdown = 5;
  countdownMapping: any = {
    '=1': '# second',
    other: '# seconds',
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor
   */
  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Sign out
    this._authService.signOut();

    // Redirect after the countdown
    timer(1000, 1000)
      .pipe(
        finalize(() => {
          this._router.navigate(['sign-in']);
        }),
        takeWhile(() => this.countdown > 0),
        takeUntil(this._unsubscribeAll),
        tap(() => this.countdown--),
      )
      .subscribe();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
