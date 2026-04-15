import { BooleanInput } from "@angular/cdk/coercion";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { Router } from "@angular/router";
import { AuthService } from "@app/core/auth/auth.service";
import { FuseConfigService } from "@fuse/services/config";
import { BCNLoadingBarService } from "@fuse/services/loading-bar";
import { User } from "app/core/user/user.types";
import { Observable, Subject, takeUntil } from "rxjs";

import { defaultNavigation } from "../../../core/navigation/navigationMap";

@Component({
  selector: "user",
  templateUrl: "./user.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: "user",

  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule, CommonModule, MatButtonModule, MatIconModule, MatMenuModule, NgOptimizedImage],
})
export class UserComponent implements OnDestroy {
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _bcnConfigService = inject(FuseConfigService);
  private _bcnLoadingBarService = inject(BCNLoadingBarService);
  auth = inject(AuthService);
  private _router = inject(Router);

  static ngAcceptInputType_showAvatar: BooleanInput;

  imiAuthInfo$: Observable<any>;
  userStatusOptions: any[];
  navigation: any;
  config: object;
  showLoadingBar: boolean;
  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  showAvatar = input(true);
  user: User;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor
   */
  constructor() {

    // Set the defaults
    this.userStatusOptions = [
      {
        title: "Online",
        icon: "icon-checkbox-marked-circle",
        color: "#4CAF50",
      },
      {
        title: "Away",
        icon: "icon-clock",
        color: "#FFC107",
      },
      {
        title: "Do not Disturb",
        icon: "icon-minus-circle",
        color: "#F44336",
      },
      {
        title: "Invisible",
        icon: "icon-checkbox-blank-circle-outline",
        color: "#BDBDBD",
      },
      {
        title: "Offline",
        icon: "icon-checkbox-blank-circle-outline",
        color: "#616161",
      },
    ];

    this.navigation = defaultNavigation;

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  // ngOnInit(): void {
  //   // Subscribe to user changes
  //   this.imiAuthInfo$ = this.auth.whoami$;
  //   // this.auth.currentUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
  //   //   this.user = user;

  //   //   // Mark for check
  //   //   this._changeDetectorRef.markForCheck();
  //   // });

  //   // Subscribe to the BCN loading bar service
  //   this._bcnLoadingBarService.visible?.pipe(takeUntil(this._unsubscribeAll)).subscribe((visible) => {
  //     this.showLoadingBar = visible;
  //   });

  //   // Subscribe to the config changes
  //   this._bcnConfigService?.config?.pipe(takeUntil(this._unsubscribeAll)).subscribe((settings) => {
  //     this.horizontalNavbar = settings.layout.navbar.position === "top";
  //     this.rightNavbar = settings.layout.navbar.position === "right";
  //     this.hiddenNavbar = settings.layout.navbar.hidden === true;
  //   });

  //   this.getAuthData();
  // }

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
   * Obtain logged user info
   */
  // getAuthData(): void {
  //   this.imiAuthInfo$ = this.auth.whoami$;
  // }

  // setRole(rol: string): void {
  //   this.auth.setRole(rol);
  //   this._router.navigateByUrl("welcome");
  // }
}
