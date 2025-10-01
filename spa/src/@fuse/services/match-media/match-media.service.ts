import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class BCNMatchMediaService {
  private _breakpointObserver = inject(BreakpointObserver);

  activeMediaQuery: { [p: string]: boolean } | string;
  onMediaChange: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor
   *
   * @param {BreakpointObserver} _breakpointObserver
   */
  constructor() {
    // Set the defaults
    this.activeMediaQuery = '';

    // Initialize
    this._init();
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
    this._breakpointObserver
      .observe(['(max-width: 599px)', '(min-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        const mediaQuery = state.matches ? state.breakpoints : '';
        if (this.activeMediaQuery !== mediaQuery) {
          this.activeMediaQuery = mediaQuery;
          if (typeof mediaQuery === 'string') {
            this.onMediaChange.next(mediaQuery);
          }
        }
      });
  }
}
