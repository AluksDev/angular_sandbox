import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  HostBinding,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { FuseAlertAppearance, FuseAlertType } from '@fuse/components/alert/alert.types';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'fuse-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  exportAs: 'fuseAlert',

  imports: [MatIconModule, MatButtonModule],
})
export class FuseAlertComponent implements OnInit, OnDestroy {
  static ngAcceptInputType_dismissible: BooleanInput;
  static ngAcceptInputType_dismissed: BooleanInput;
  static ngAcceptInputType_showIcon: BooleanInput;

  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _fuseAlertService = inject(FuseAlertService);
  private _fuseUtilsService = inject(FuseUtilsService);

  appearance = input<FuseAlertAppearance>('soft');
  dismissedInput = input(false);
  dismissed = signal(false);
  dismissibleInput = input(false);
  dismissible = signal(false);
  name = input<string>(this._fuseUtilsService.randomId());
  showIconInput = input(true);
  showIcon = signal(true);
  type = input<FuseAlertType>('primary');
  @Output() readonly dismissedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    effect(() => {
      const currentDismissed = this.dismissedInput();
      this.dismissed.set(coerceBooleanProperty(currentDismissed));

      // Dismiss/show the alert
      this._toggleDismiss(this.dismissed());
    });
    effect(() => {
      const currentDismissible = this.dismissibleInput();
      this.dismissible.set(coerceBooleanProperty(currentDismissible));
    });
    effect(() => {
      const currentShowIcon = this.showIconInput();
      this.showIcon.set(coerceBooleanProperty(currentShowIcon));
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Host binding for component classes
   */
  @HostBinding('class') get classList(): any {
    return {
      'fuse-alert-appearance-border': this.appearance() === 'border',
      'fuse-alert-appearance-fill': this.appearance() === 'fill',
      'fuse-alert-appearance-outline': this.appearance() === 'outline',
      'fuse-alert-appearance-soft': this.appearance() === 'soft',
      'fuse-alert-dismissed': this.dismissedInput(),
      'fuse-alert-dismissible': this.dismissibleInput(),
      'fuse-alert-show-icon': this.showIconInput(),
      'fuse-alert-type-primary': this.type() === 'primary',
      'fuse-alert-type-accent': this.type() === 'accent',
      'fuse-alert-type-warn': this.type() === 'warn',
      'fuse-alert-type-basic': this.type() === 'basic',
      'fuse-alert-type-info': this.type() === 'info',
      'fuse-alert-type-success': this.type() === 'success',
      'fuse-alert-type-warning': this.type() === 'warning',
      'fuse-alert-type-error': this.type() === 'error',
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the dismiss calls
    this._fuseAlertService.onDismiss
      .pipe(
        filter((name) => this.name() === name),
        takeUntil(this._unsubscribeAll),
      )
      .subscribe(() => {
        // Dismiss the alert
        this.dismiss();
      });

    // Subscribe to the show calls
    this._fuseAlertService.onShow
      .pipe(
        filter((name) => this.name() === name),
        takeUntil(this._unsubscribeAll),
      )
      .subscribe(() => {
        // Show the alert
        this.show();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Dismiss the alert
   */
  dismiss(): void {
    // Return if the alert is already dismissed
    if (this.dismissed()) {
      return;
    }

    // Dismiss the alert
    this._toggleDismiss(true);
  }

  /**
   * Show the dismissed alert
   */
  show(): void {
    // Return if the alert is already showing
    if (!this.dismissed()!) {
      return;
    }

    // Show the alert
    this._toggleDismiss(false);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Dismiss/show the alert
   *
   * @param dismissed
   * @private
   */
  private _toggleDismiss(dismissed: boolean): void {
    // Return if the alert is not dismissible
    if (!this.dismissible()) {
      return;
    }

    // Set the dismissed
    this.dismissed.set(dismissed);

    // Execute the observable
    this.dismissedChanged.next(this.dismissed()!);

    // Notify the change detector
    this._changeDetectorRef.markForCheck();
  }
}
