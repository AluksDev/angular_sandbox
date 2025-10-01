import { Injectable, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BCNLoadingBarService {
  private _router = inject(Router);

  // Private
  private _visible: BehaviorSubject<boolean>;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor
   *
   * @param {Router} _router
   */
  constructor() {
    // Initialize the service
    this._init();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get visible(): Observable<any> {
    // Return the _visible as observable
    return this._visible.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Initialize
   *
   * @private
   */
  private _init(): void {
    // Initialize the behavior subject
    this._visible = new BehaviorSubject(false);

    // Subscribe to the router events to show/hide the loading bar
    this._router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      this.showLoadingBar();
    });

    this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.hideLoadingBar();
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show the loading bar
   */
  showLoadingBar(): void {
    // Show
    this._visible.next(true);
  }

  /**
   * Hide the loading bar
   */
  hideLoadingBar(): void {
    // Hide
    this._visible.next(false);
  }
}
