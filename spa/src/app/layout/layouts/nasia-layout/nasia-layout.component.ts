import { NgClass, NgIf, AsyncPipe } from "@angular/common";
import { Component, inject, OnDestroy, signal, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "@app/core/auth/auth.service";
import { defaultNavigation } from "@app/core/navigation/navigationMap";
import { FuseNavigationService, FuseVerticalNavigationComponent } from "@fuse/components/navigation";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { ContentComponent } from "@layout/components/content/content.component";
import { GlobalSpinnerComponent } from "@layout/components/global-spinner/global-spinner.component";
import { LayoutService } from "@utils/layout.service";
import { finalize, Subject } from "rxjs";
import { UserSidebarSnippetComponent } from "@app/core/user/components/user-sidebar-snippet-component/user-sidebar-snippet-component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "nasia-layout",
  templateUrl: "./nasia-layout.component.html",
  styleUrls: ["./nasia-layout.component.scss"],
  encapsulation: ViewEncapsulation.None,
  imports: [NgClass, GlobalSpinnerComponent, ContentComponent, FuseVerticalNavigationComponent, MatIconModule, MatButtonModule, UserSidebarSnippetComponent, NgIf, AsyncPipe, MatProgressSpinnerModule],
})
export class NasiaLayoutComponent implements  OnDestroy {
  authService = inject(AuthService);
  user$ = this.authService.currentUser$;
  loading = signal<boolean>(false);
  router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  onUserAction(action: string){
    switch (action){
      case 'logout':
        this.logout();
        break;
    }
  }

  logout(){
    this.loading.set(true);
    this.authService.logout()
    .pipe(
      finalize(()=> this.loading.set(false))
    )
    .subscribe({
      next: ((res) => {
        this.openSnackBar(res.detail, 'Close');
        this.router.navigate(['/auth/login']);
      }),
      error: ()=>{
        this.openSnackBar('Something went wrong', 'Close');
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }











  navigation: any;

  folded = false;
  isScreenSmall: boolean;
  private _fuseMediaWatcherService = inject(FuseMediaWatcherService);
  private _bcnNavigationService = inject(FuseNavigationService);
  private _fuseNavigationService = inject(FuseNavigationService);
  private _authService = inject(AuthService);

  _layoutService = inject(LayoutService);
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   */
  constructor() {
    // Set the defaults
    this.navigation = defaultNavigation;
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  // ngOnInit(): void {
  //   // Subscribe to media changes
  //   this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
  //     // Check if the screen is small
  //     this.isScreenSmall = !matchingAliases.includes("md");
  //   });

  //   // Get current navigation
  //   this._bcnNavigationService.onNavigationChanged.pipe(filter((value) => value !== null)).subscribe(() => {
  //     this.navigation.forEach((item) => {
  //       if (!!item.meta.requiredServices) {
  //         this._authService.isAllowed(item.meta.requiredServices).subscribe((value) => {
  //           item.hidden = () => !value;
  //         });
  //       }
  //     });
  //     this.navigation = this._bcnNavigationService.getCurrentNavigation();
  //   });
  // }

  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // if (this.bcnPerfectScrollbarUpdateTimeout) {
    //   clearTimeout(this.bcnPerfectScrollbarUpdateTimeout);
    // }

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(undefined);
    this._unsubscribeAll.complete();
  }
}
