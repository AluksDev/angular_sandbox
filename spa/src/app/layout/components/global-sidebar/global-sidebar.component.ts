import { AnimationBuilder, AnimationPlayer } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, effect, ElementRef, HostBinding, inject, Input, input, OnDestroy, OnInit, output, Renderer2, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { SidebarService } from "@fuse/services/sidebar";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-global-sidebar",
  templateUrl: "./global-sidebar.component.html",

  imports: [MatIconModule, CommonModule, MatButtonModule, RouterLink],
  styleUrls: ["./global-sidebar.component.scss"],
})
export class GlobalSidebarComponent implements OnInit, OnDestroy {
  private _animationBuilder = inject(AnimationBuilder);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _elementRef = inject(ElementRef);
  private _renderer = inject(Renderer2);
  sidebarService = inject(SidebarService);
  private router = inject(Router);

  // Position
  positionInput = input<"left" | "right">();
  position = signal<"left" | "right">("left");

  // Private
  private _folded: boolean;
  private _player: AnimationPlayer;
  private _unsubscribeAll: Subject<any>;

  @HostBinding("class.animations-enabled")
  private _animationsEnabled: boolean;

  readonly foldevent = output<boolean>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor
   *
   */
  constructor() {
    effect(() => {
      const positionLocal = this.positionInput();
      this.position.set(positionLocal);
    });

    // Set the private defaults
    this._animationsEnabled = false;
    this._unsubscribeAll = new Subject();
    this._folded = true;

    this.sidebarService
      .changeCurrent()
      .pipe(
        map((val) => {
          if (val === null) {
            this.fold();
          } else {
            this.unfold();
          }
        })
      )
      .subscribe();

    this.router.events.subscribe(() => this.sidebarService.close());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // Folded
  @Input()
  set folded(value: boolean) {
    // Set the folded
    this._folded = value;

    // If folded...
    if (value) {
      // Fold the sidebar
      this.fold();
      this._renderer.setStyle(this._elementRef.nativeElement, "min-width", "0px");
      this._renderer.setStyle(this._elementRef.nativeElement, "max-width", "0px");
      this._renderer.setStyle(this._elementRef.nativeElement, "box-shadow", "none");
      this._renderer.setStyle(this._elementRef.nativeElement, "visibility", "hidden");
    }
    // If unfolded...
    else {
      // Unfold the sidebar
      this.unfold();
      let size = "250px";
      if (this.sidebarService.size === "big") {
        size = "420px";
      }
      this._renderer.setStyle(this._elementRef.nativeElement, "min-width", size);
      this._renderer.setStyle(this._elementRef.nativeElement, "max-width", size);

      this._renderer.removeStyle(this._elementRef.nativeElement, "box-shadow");
      this._renderer.removeStyle(this._elementRef.nativeElement, "visibility");
    }
  }

  get folded(): boolean {
    return this._folded;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const positionLocal = this.positionInput();
    this.position.set(positionLocal);

    // Setup position
    this._setupPosition();

    // Setup folded
    this._setupFolded();
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
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setup the sidebar position
   *
   * @private
   */
  private _setupPosition(): void {
    // Add the correct class name to the sidebar
    // element depending on the position attribute
    if (this.position() === "right") {
      this._renderer.addClass(this._elementRef.nativeElement, "right-positioned");
    } else {
      this._renderer.addClass(this._elementRef.nativeElement, "left-positioned");
    }
  }

  /**
   * Setup the initial folded status
   *
   * @private
   */
  private _setupFolded(): void {
    if (this.folded) {
      this.folded = true;
    }
  }

  /**
   * Enable the animations
   *
   * @private
   */
  private _enableAnimations(): void {
    // Return if animations already enabled
    if (this._animationsEnabled) {
      return;
    }

    // Enable the animations
    this._animationsEnabled = true;

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Fold the sidebar permanently
   */
  fold(): void {
    // Only work if the sidebar is not folded
    if (this.folded) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Fold
    this.folded = true;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Emit event
    this.foldevent.emit(true);
    this.sidebarService.fold();
  }

  /**
   * Unfold the sidebar permanently
   */
  unfold(): void {
    // Only work if the sidebar is folded
    if (!this.folded) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Unfold
    this.folded = false;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Emit event
    this.foldevent.emit(false);
    this.sidebarService.unfold();
  }

  /**
   * Toggle the sidebar fold/unfold permanently
   */
  toggleFold(): void {
    if (this.folded) {
      this.unfold();
    } else {
      this.fold();
    }
  }
}
