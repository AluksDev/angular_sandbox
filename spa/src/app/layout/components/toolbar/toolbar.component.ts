import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { BCNSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { BCNLoadingBarService } from '@fuse/services/loading-bar';
import { IfAllowedDirective } from '@utils/directives/if-allowed.directive';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IMIAuthorization } from 'api/model';
import { AuthService } from '@app/core/auth/services/auth.service';
import { Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config';
import { RuntimeConfigService } from '@app/runtime-config.service';
import { FuseThemeService } from '@fuse/services/theme/theme.service';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  imports: [
    MatIcon,
    NgIf,
    MatButton,
    MatIconButton,
    MatProgressBar,
    MatToolbar,
    AsyncPipe,
    MatMenu,
    IfAllowedDirective,
  ],
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  navigation: any;
  showLoadingBar: boolean;
  userStatusOptions: any[];
  imiAuthInfo$: Observable<IMIAuthorization | {}>;
  config: Object;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param _bcnConfigService
   * @param {BCNLoadingBarService} _bcnLoadingBarService
   * @param {BCNSidebarService} _bcnSidebarService
   * @param auth
   * @param configService
   * @param themeService
   * @param _router
   */
  constructor(
    private _bcnConfigService: FuseConfigService,
    private _bcnLoadingBarService: BCNLoadingBarService,
    private _bcnSidebarService: BCNSidebarService,
    public auth: AuthService,
    private configService: RuntimeConfigService,
    public themeService: FuseThemeService,
    private _router: Router,
  ) {
    // Set the defaults
    this.userStatusOptions = [
      {
        title: 'Online',
        icon: 'icon-checkbox-marked-circle',
        color: '#4CAF50',
      },
      {
        title: 'Away',
        icon: 'icon-clock',
        color: '#FFC107',
      },
      {
        title: 'Do not Disturb',
        icon: 'icon-minus-circle',
        color: '#F44336',
      },
      {
        title: 'Invisible',
        icon: 'icon-checkbox-blank-circle-outline',
        color: '#BDBDBD',
      },
      {
        title: 'Offline',
        icon: 'icon-checkbox-blank-circle-outline',
        color: '#616161',
      },
    ];

    this.navigation = this.navigation;
    this.config = configService.config;

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the BCN loading bar service
    this._bcnLoadingBarService.visible.pipe(takeUntil(this._unsubscribeAll)).subscribe((visible) => {
      this.showLoadingBar = visible;
    });

    // Subscribe to the config changes
    this._bcnConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((settings) => {
      this.horizontalNavbar = settings.layout.navbar.position === 'top';
      this.rightNavbar = settings.layout.navbar.position === 'right';
      this.hiddenNavbar = settings.layout.navbar.hidden === true;
    });

    this.getAuthData();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(undefined);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void {
    this._bcnSidebarService.getSidebar(key).toggleOpen();
  }

  /**
   * Search
   *
   * @param value
   */
  search(value): void {
    // Do your search here...
  }

  /**
   * Obtain logged user info
   */
  getAuthData(): void {
    this.imiAuthInfo$ = this.auth.whoami$;
  }

  setRole(rol: string): void {
    this.auth.setRole(rol);
    this._router.navigateByUrl('welcome');
  }

  disableImpersonation(): void {
    this.auth.setRole(null);
    this._router.navigateByUrl('welcome');
  }
}
