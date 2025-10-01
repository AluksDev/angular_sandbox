import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  Injector,
  input,
  OnDestroy,
  runInInjectionContext,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FuseLoadingService } from '@fuse/services/loading';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'fuse-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'fuseLoadingBar',

  imports: [MatProgressBarModule],
})
export class FuseLoadingBarComponent implements OnDestroy {
  private _fuseLoadingService = inject(FuseLoadingService);
  private injector: Injector = inject(Injector); // Define injector instance
  private cdr = inject(ChangeDetectorRef);

  autoModeInput = input(true);
  autoMode = signal(true);
  // mode: 'determinate' | 'indeterminate';
  // progress = 0;
  // show = false;

  mode = signal<'determinate' | 'indeterminate'>('indeterminate');
  progress = signal(0);
  show = signal(false);

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  constructor() {
    // Ensure effects run in an injection context
    runInInjectionContext(this.injector, () => {
      // Effect for autoMode
      effect(() => {
        const autoModeValue = coerceBooleanProperty(this.autoModeInput());
        this.autoMode.set(autoModeValue);
        this._fuseLoadingService.setAutoMode(autoModeValue);
      });

      // Effect for mode
      effect(() => {
        this._fuseLoadingService.mode$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
          this.mode.set(value);
        });
      });

      // Effect for progress
      effect(() => {
        this._fuseLoadingService.progress$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
          this.progress.set(value);
        });
      });

      // Effect for show
      effect(() => {
        this._fuseLoadingService.show$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
          this.show.set(value);
        });
      });
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
}
