import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  ViewEncapsulation,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { ReplaySubject, Subject } from 'rxjs';

import { FuseHorizontalNavigationBasicItemComponent } from './components/basic/basic.component';
import { FuseHorizontalNavigationBranchItemComponent } from './components/branch/branch.component';
import { FuseHorizontalNavigationSpacerItemComponent } from './components/spacer/spacer.component';

@Component({
  selector: 'fuse-horizontal-navigation',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'fuseHorizontalNavigation',

  imports: [
    FuseHorizontalNavigationBasicItemComponent,
    FuseHorizontalNavigationBranchItemComponent,
    FuseHorizontalNavigationSpacerItemComponent,
  ],
})
export class FuseHorizontalNavigationComponent implements OnInit, OnDestroy {
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _fuseNavigationService = inject(FuseNavigationService);
  private _fuseUtilsService = inject(FuseUtilsService);

  nameInput = input<string>(this._fuseUtilsService.randomId());
  name = signal<string>(this._fuseUtilsService.randomId());
  navigation = input<FuseNavigationItem[]>();

  onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  constructor() {
    effect(() => {
      const navigationLocal = this.navigation();
      this._changeDetectorRef.markForCheck();
    });
    effect(() => {
      const nameLocal = this.nameInput();
      this.name.set(nameLocal);
    });
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Make sure the name input is not an empty string
    if (this.name() === '') {
      this.name.set(this._fuseUtilsService.randomId());
    }

    // Register the navigation component
    this._fuseNavigationService.registerComponent(this.name(), this);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Deregister the navigation component from the registry
    this._fuseNavigationService.deregisterComponent(this.name());

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Refresh the component to apply the changes
   */
  refresh(): void {
    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Execute the observable
    this.onRefreshed.next(true);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
