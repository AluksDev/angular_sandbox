import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { FuseDrawerService } from '@fuse/components/drawer/drawer.service';
import { FuseDrawerMode, FuseDrawerPosition } from '@fuse/components/drawer/drawer.types';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';

@Component({
  selector: 'fuse-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'fuseDrawer',
})
export class FuseDrawerComponent implements OnInit, OnDestroy {
  static ngAcceptInputType_fixed: BooleanInput;
  static ngAcceptInputType_opened: BooleanInput;
  static ngAcceptInputType_transparentOverlay: BooleanInput;

  private _animationBuilder = inject(AnimationBuilder);
  private _elementRef = inject(ElementRef);
  private _renderer2 = inject(Renderer2);
  private _fuseDrawerService = inject(FuseDrawerService);
  private _fuseUtilsService = inject(FuseUtilsService);

  fixedInput = input(false);
  fixed = signal(false);
  mode = input<FuseDrawerMode>('side');
  previousMode: string | undefined;
  name = input<string>(this._fuseUtilsService.randomId());
  openedInput = input(false);
  opened = signal(false);
  position = input<FuseDrawerPosition>('left');
  transparentOverlayInput = input(false);
  transparentOverlay = signal(false);

  @Output() readonly fixedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() readonly modeChanged: EventEmitter<FuseDrawerMode> = new EventEmitter<FuseDrawerMode>();
  @Output() readonly openedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() readonly positionChanged: EventEmitter<FuseDrawerPosition> = new EventEmitter<FuseDrawerPosition>();

  private _animationsEnabled = false;
  private readonly _handleOverlayClick = (): void => this.close();
  private _hovered = false;
  private _overlay: HTMLElement;
  private _player: AnimationPlayer;

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Host binding for component classes
   */
  @HostBinding('class') get classList(): any {
    return {
      'fuse-drawer-animations-enabled': this._animationsEnabled,
      'fuse-drawer-fixed': this.fixed(),
      'fuse-drawer-hover': this._hovered,
      [`fuse-drawer-mode-${this.mode()}`]: true,
      'fuse-drawer-opened': this.opened(),
      [`fuse-drawer-position-${this.position()}`]: true,
    };
  }

  /**
   * Host binding for component inline styles
   */
  @HostBinding('style') get styleList(): any {
    return {
      visibility: this.opened() ? 'visible' : 'hidden',
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Decorated methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On mouseenter
   *
   * @private
   */
  @HostListener('mouseenter')
  private _onMouseenter(): void {
    // Enable the animations
    this._enableAnimations();

    // Set the hovered
    this._hovered = true;
  }

  /**
   * On mouseleave
   *
   * @private
   */
  @HostListener('mouseleave')
  private _onMouseleave(): void {
    // Enable the animations
    this._enableAnimations();

    // Set the hovered
    this._hovered = false;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  constructor() {
    effect(() => {
      const fixed = this.fixedInput();
      this.fixed.set(coerceBooleanProperty(fixed));

      // Execute the observable
      this.fixedChanged.next(this.fixed());
    });
    effect(() => {
      const mode = this.mode();
      // Get the previous and current values
      const currentMode = mode;

      // Disable the animations
      this._disableAnimations();

      // If the mode changes: 'over -> side'
      if (this.previousMode === 'over' && currentMode === 'side') {
        // Hide the overlay
        this._hideOverlay();
      }

      // If the mode changes: 'side -> over'
      if (this.previousMode === 'side' && currentMode === 'over') {
        // If the drawer is opened
        if (this.opened()) {
          // Show the overlay
          this._showOverlay();
        }
      }

      // Execute the observable
      this.modeChanged.next(currentMode);
      this.previousMode = mode;

      // Enable the animations after a delay
      // The delay must be bigger than the current transition-duration
      // to make sure nothing will be animated while the mode is changing
      setTimeout(() => {
        this._enableAnimations();
      }, 500);
    });
    effect(() => {
      const open = this.openedInput();
      this.opened.set(open);
      // Open/close the drawer
      this._toggleOpened(coerceBooleanProperty(open));
    });
    effect(() => {
      const position = this.position();
      this.positionChanged.next(position);
    });
    effect(() => {
      const transparent = this.transparentOverlayInput();
      this.transparentOverlay.set(coerceBooleanProperty(transparent));
    });
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Register the drawer
    this._fuseDrawerService.registerComponent(this.name(), this);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Finish the animation
    if (this._player) {
      this._player.finish();
    }

    // Deregister the drawer from the registry
    this._fuseDrawerService.deregisterComponent(this.name());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open the drawer
   */
  open(): void {
    // Return if the drawer has already opened
    if (this.opened()) {
      return;
    }

    // Open the drawer
    this._toggleOpened(true);
  }

  /**
   * Close the drawer
   */
  close(): void {
    // Return if the drawer has already closed
    if (!this.opened()!) {
      return;
    }

    // Close the drawer
    this._toggleOpened(false);
  }

  /**
   * Toggle the drawer
   */
  toggle(): void {
    if (this.opened()) {
      this.close();
    } else {
      this.open();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Enable the animations
   *
   * @private
   */
  private _enableAnimations(): void {
    // Return if the animations are already enabled
    if (this._animationsEnabled) {
      return;
    }

    // Enable the animations
    this._animationsEnabled = true;
  }

  /**
   * Disable the animations
   *
   * @private
   */
  private _disableAnimations(): void {
    // Return if the animations are already disabled
    if (!this._animationsEnabled) {
      return;
    }

    // Disable the animations
    this._animationsEnabled = false;
  }

  /**
   * Show the backdrop
   *
   * @private
   */
  private _showOverlay(): void {
    // Create the backdrop element
    this._overlay = this._renderer2.createElement('div');

    // Add a class to the backdrop element
    this._overlay.classList.add('fuse-drawer-overlay');

    // Add a class depending on the fixed option
    if (this.fixed()) {
      this._overlay.classList.add('fuse-drawer-overlay-fixed');
    }

    // Add a class depending on the transparentOverlay option
    if (this.transparentOverlay()) {
      this._overlay.classList.add('fuse-drawer-overlay-transparent');
    }

    // Append the backdrop to the parent of the drawer
    this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._overlay);

    // Create enter animation and attach it to the player
    this._player = this._animationBuilder
      .build([style({ opacity: 0 }), animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 }))])
      .create(this._overlay);

    // Play the animation
    this._player.play();

    // Add an event listener to the overlay
    this._overlay.addEventListener('click', this._handleOverlayClick);
  }

  /**
   * Hide the backdrop
   *
   * @private
   */
  private _hideOverlay(): void {
    if (!this._overlay) {
      return;
    }

    // Create the leave animation and attach it to the player
    this._player = this._animationBuilder
      .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))])
      .create(this._overlay);

    // Play the animation
    this._player.play();

    // Once the animation is done...
    this._player.onDone(() => {
      // If the overlay still exists...
      if (this._overlay) {
        // Remove the event listener
        this._overlay.removeEventListener('click', this._handleOverlayClick);

        // Remove the overlay
        this._overlay.parentNode.removeChild(this._overlay);
        this._overlay = null;
      }
    });
  }

  /**
   * Open/close the drawer
   *
   * @param open
   * @private
   */
  private _toggleOpened(open: boolean): void {
    // Set the opened
    this.opened.set(open);

    // Enable the animations
    this._enableAnimations();

    // If the mode is 'over'
    if (this.mode() === 'over') {
      // If the drawer opens, show the overlay
      if (open) {
        this._showOverlay();
      }
      // Otherwise, close the overlay
      else {
        this._hideOverlay();
      }
    }

    // Execute the observable
    this.openedChanged.next(open);
  }
}
