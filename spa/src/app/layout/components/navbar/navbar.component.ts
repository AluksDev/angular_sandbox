import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NavigationService } from '@core/navigation/navigation.service';
import { Navigation } from '@core/navigation/navigation.types';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { BCNSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { BCNPerfectScrollbarDirective } from '@fuse/directives/bcn-perfect-scrollbar/bcn-perfect-scrollbar.directive';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseThemeService } from '@fuse/services/theme/theme.service';
import { Subject } from 'rxjs';
import { filter, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  imports: [FuseVerticalNavigationComponent],
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  bcnPerfectScrollbarUpdateTimeout: any;
  navigation: any;
  buttonTop = true;
  isScreenSmall: boolean;

  private _fuseMediaWatcherService = inject(FuseMediaWatcherService);
  private _navigationService = inject(NavigationService);

  // Private
  private _bcnPerfectScrollbar: BCNPerfectScrollbarDirective;
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param _bcnNavigationService
   * @param {BCNSidebarService} _bcnSidebarService
   * @param {Router} _router
   * @param themeService
   */
  constructor(
    private _bcnNavigationService: FuseNavigationService,
    private _bcnSidebarService: BCNSidebarService,
    private _router: Router,
    private themeService: FuseThemeService,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  changeButton(): void {
    this.buttonTop = !this.buttonTop;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // Directive
  @ViewChild(BCNPerfectScrollbarDirective, { static: false })
  set directive(theDirective: BCNPerfectScrollbarDirective) {
    if (!theDirective) {
      return;
    }

    this._bcnPerfectScrollbar = theDirective;

    // Update the scrollbar on collapsable item toggle
    this._bcnNavigationService.onItemCollapseToggled.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.bcnPerfectScrollbarUpdateTimeout = setTimeout(() => {
        this._bcnPerfectScrollbar.update();
      }, 310);
    });

    // Scroll to the active item position
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => {
        setTimeout(() => {
          const activeNavItem: any = document.querySelector('navbar .nav-link.active');

          if (activeNavItem) {
            const activeItemOffsetTop = activeNavItem.offsetTop;
            const activeItemOffsetParentTop = activeNavItem.offsetParent.offsetTop;
            const scrollDistance = activeItemOffsetTop - activeItemOffsetParentTop - 48 * 3;

            this._bcnPerfectScrollbar.scrollToTop(scrollDistance);
          }
        });
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to navigation data
    this._navigationService.navigation$.pipe(takeUntil(this._unsubscribeAll)).subscribe((navigation: Navigation) => {
      this.navigation = navigation;
    });

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll),
      )
      .subscribe((newUrl) => {
        if (this._bcnSidebarService.getSidebar('navbar')) {
          this._bcnSidebarService.getSidebar('navbar').close();
        }
      });

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this._unsubscribeAll),
        tap((newUrl: NavigationStart) => {
          const newPath = newUrl.url.split('#')[0];
          const oldPath = this._router.url.split('#')[0];
          if (newPath !== oldPath) {
            // Only restart the color when out of place, event and entity areas
            if (newPath.indexOf('/place') < 0 && newPath.indexOf('/event') < 0 && newPath.indexOf('/entity') < 0) {
              this.themeService.resetTheme();
            }
          }
        }),
      )
      .subscribe();

    // Get current navigation
    this._bcnNavigationService.onNavigationChanged.pipe(filter((value) => value !== null)).subscribe(() => {
      this.navigation = this._bcnNavigationService.getCurrentNavigation();
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    if (this.bcnPerfectScrollbarUpdateTimeout) {
      clearTimeout(this.bcnPerfectScrollbarUpdateTimeout);
    }

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(undefined);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar opened status
   */
  toggleSidebarOpened(): void {
    this._bcnSidebarService.getSidebar('navbar').toggleOpen();
  }

  /**
   * Toggle sidebar folded status
   */
  toggleSidebarFolded(): void {
    this._bcnSidebarService.getSidebar('navbar').toggleFold();
  }
}
