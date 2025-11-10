import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { NavigationStart, Router, RouterOutlet } from "@angular/router";
import { FuseLoadingBarComponent } from "@fuse/components/loading-bar";
import { FuseNavigationService, FuseVerticalNavigationComponent } from "@fuse/components/navigation";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { FuseThemeService } from "@fuse/services/theme/theme.service";
import { UserComponent } from "@layout/common/user/user.component";
import { LayoutService } from "@utils/layout.service";
import { NavigationService } from "app/core/navigation/navigation.service";
import { Navigation } from "app/core/navigation/navigation.types";
import { Subject, takeUntil } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { Location } from "@angular/common";
import { HeaderComponent } from "@utils/components/header.component/header.component";
import { BreadcrumbComponent } from "@utils/components/breadcrumb/breadcrumb.component";
@Component({
  selector: "classic-layout",
  templateUrl: "./classic.component.html",
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterOutlet, MatButtonModule, MatIconModule, FuseLoadingBarComponent, HeaderComponent, BreadcrumbComponent],
})
export class ClassicLayoutComponent implements OnInit, OnDestroy {
  private _navigationService = inject(NavigationService);
  private _fuseMediaWatcherService = inject(FuseMediaWatcherService);
  private _fuseNavigationService = inject(FuseNavigationService);
  private themeService = inject(FuseThemeService);
  public _layoutService = inject(LayoutService);

  location = inject(Location);
  showBreadcrumbs = this._layoutService.getShowBreadcrumbs;
  showTitle = this._layoutService.getShowTitle;
  breadcrumbs = this._layoutService.getBreadcrumbs;

  isScreenSmall: boolean;
  navigation: Navigation;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor
   */
  constructor(private _router: Router) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

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
    this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
      // Check if the screen is small
      this.isScreenSmall = !matchingAliases.includes("md");
    });

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this._unsubscribeAll),
        tap((newUrl: NavigationStart) => {
          const newPath = newUrl.url.split("#")[0];
          const oldPath = this._router.url.split("#")[0];
          if (newPath !== oldPath) {
            // Only restart the color when out of place, event and entity areas
            if (newPath.indexOf("/place") < 0 && newPath.indexOf("/event") < 0 && newPath.indexOf("/entity") < 0) {
              this.themeService.resetTheme();
            }
          }
        })
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

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle navigation
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }
}
