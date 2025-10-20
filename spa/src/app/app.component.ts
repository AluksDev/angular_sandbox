import { NgClass } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "@app/core/auth/services/auth.service";
import { FuseNavigationItem, FuseNavigationService } from "@fuse/components/navigation";
import { FuseConfigService } from "@fuse/services/config";
import { FuseThemeService } from "@fuse/services/theme/theme.service";
import { NasiaLayoutComponent } from "@layout/layouts/nasia-layout/nasia-layout.component";
import { NgSelectConfig } from "@ng-select/ng-select";
import { Subject, Subscription } from "rxjs";

import { Router, RouterOutlet } from "@angular/router";
import { LayoutService } from "@utils/layout.service";
import { defaultNavigation } from "./core/navigation/navigationMap";
import { RuntimeConfigService } from "./runtime-config.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [NasiaLayoutComponent, NgClass, RouterOutlet],
  providers: [],
})
export class AppComponent implements OnInit, OnDestroy {
  mainColor = "theme_original";
  private themeSubscription: Subscription;

  private _bcnConfigService = inject(FuseConfigService);
  private _bcnNavigationService = inject(FuseNavigationService);
  private config = inject(NgSelectConfig);
  themeService = inject(FuseThemeService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private runtime = inject(RuntimeConfigService);
  private layoutService = inject(LayoutService);
  private _router = inject(Router);

  navigation: FuseNavigationItem[];
  bcnConfig: any;

  // Private
  private _unsubscribeAll: Subject<void>;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor
   *
   */
  constructor(protected themeService2: FuseThemeService) {
    // Get default navigation
    this.navigation = defaultNavigation;

    // Register the navigation to the service
    this._bcnNavigationService.register("main", this.navigation);

    // Set the main navigation as our current navigation
    this._bcnNavigationService.setCurrentNavigation("main");

    // Set the private defaults
    this._unsubscribeAll = new Subject();

    // Configure default ng-select
    this.config.notFoundText = "Custom not found";
    this.config.placeholder = "Seleccioneu l'element";
    this.config.notFoundText = "No hi ha elements";
    this.config.addTagText = "Afegir element";
    this.config.typeToSearchText = "Cerca...";
    this.config.loadingText = "Carregant...";
    this.config.clearAllText = "Esborrar";

    this.themeSubscription = this.themeService.currentTheme$.subscribe((theme) => {
      this.mainColor = theme;
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {}

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this.themeSubscription.unsubscribe(); // Evitar memory leaks
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
}
