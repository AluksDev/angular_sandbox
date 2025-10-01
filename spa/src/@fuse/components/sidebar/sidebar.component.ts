import {
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  Renderer2,
  RendererStyleFlags2,
  signal,
} from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { BCNSidebarService } from './sidebar.service';
import { FuseConfigService } from '../../services/config';
import { BCNMatchMediaService } from '../../services/match-media';

@Component({
  selector: 'bcn-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class BCNSidebarComponent implements OnInit, OnDestroy {
  private _animationBuilder = inject(AnimationBuilder);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _elementRef = inject(ElementRef);
  private _bcnConfigService = inject(FuseConfigService);
  private _bcnMatchMediaService = inject(BCNMatchMediaService);
  private _bcnSidebarService = inject(BCNSidebarService);
  private _breakpointObserver = inject(BreakpointObserver);

  private _renderer = inject(Renderer2);

  // Name
  name = input<string>();

  // Key
  key = input<string>();

  foldedInput = input<boolean>();
  folded = signal<boolean>(false);

  // Position
  positionInput = input<'left' | 'right'>();
  position = signal<'left' | 'right'>('left');

  // Open
  @HostBinding('class.open')
  opened: boolean;

  // Locked Open
  lockedOpen = input<string>();

  // isLockedOpen
  @HostBinding('class.locked-open')
  isLockedOpen: boolean;

  // Folded unfolded
  @HostBinding('class.unfolded')
  unfolded: boolean;

  // Invisible overlay
  invisibleOverlay = input<boolean>();

  // Private
  private _folded: boolean;
  private _bcnConfig: any;
  private _wasActive: boolean;
  private _wasFolded: boolean;
  private _backdrop: HTMLElement | null = null;
  private _player: AnimationPlayer;
  private _unsubscribeAll: Subject<any>;

  @HostBinding('class.animations-enabled')
  private _animationsEnabled: boolean;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor
   *
   */
  constructor() {
    // Set the defaults
    this.opened = false;
    // this.folded = false;

    this._breakpointObserver.observe([Breakpoints.XSmall]).subscribe((result) => {
      this.isLockedOpen = !result.matches;
      this._changeDetectorRef.markForCheck();
    });

    effect(() => {
      this.positionInput(); // Actualiza la posición si es necesario
      this.foldedInput(); // Actualiza el estado plegado
      if (this.opened) {
        this._updateSidebarState();
      }
    });

    // Set the private defaults
    this._animationsEnabled = false;
    this._folded = false;
    this._unsubscribeAll = new Subject();
    effect(() => {
      const positionLocal = this.positionInput();
      this.position.set(positionLocal);
    });
    effect(() => {
      const foldedLocal = this.foldedInput();
      this.folded.set(foldedLocal);

      // Return if the sidebar is closed
      if (!this.opened) {
        return;
      }

      // Programmatically add/remove margin to the element
      // that comes after or before based on the position
      let sibling, styleRule;

      const styleValue = '64px';

      // Get the sibling and set the style rule
      if (this.position() === 'left') {
        sibling = this._elementRef.nativeElement.nextElementSibling;
        styleRule = 'margin-left';
      } else {
        sibling = this._elementRef.nativeElement.previousElementSibling;
        styleRule = 'margin-right';
      }
      // If there is no sibling, return...
      if (!sibling) {
        return;
      }

      // If folded...
      if (foldedLocal) {
        // Fold the sidebar
        this.fold();

        // Set the style and class
        this._renderer.setStyle(
          sibling,
          styleRule,
          styleValue,
          RendererStyleFlags2.Important + RendererStyleFlags2.DashCase,
        );
        this._renderer.addClass(this._elementRef.nativeElement, 'folded');
      }
      // If unfolded...
      else {
        // Unfold the sidebar
        this.unfold();

        // Remove the style and class
        this._renderer.removeStyle(sibling, styleRule);
        this._renderer.removeClass(this._elementRef.nativeElement, 'folded');
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.position.set(this.positionInput());
    this.folded.set(this.foldedInput());
    // Subscribe to config changes
    this._bcnConfigService.config$.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
      this._bcnConfig = config;
    });

    // Register the sidebar
    this._bcnSidebarService.register(this.name(), this);

    // Setup visibility
    this._setupVisibility();

    // Setup position
    this._setupPosition();

    // Setup lockedOpen
    this._setupLockedOpen();

    // Setup folded
    this._setupFolded();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // If the sidebar is folded, unfold it to revert modifications
    if (this.folded) {
      this.unfold();
    }

    // Unregister the sidebar
    this._bcnSidebarService.unregister(this.name());

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(undefined);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  // Método para verificar el estado de un breakpoint específico
  isLockedOpenFunc(): boolean {
    return this._breakpointObserver.isMatched(Breakpoints.Web);
  }

  private _updateSidebarState(): void {
    const sibling =
      this.positionInput() === 'left'
        ? this._elementRef.nativeElement.nextElementSibling
        : this._elementRef.nativeElement.previousElementSibling;
    const styleRule = this.positionInput() === 'left' ? 'margin-left' : 'margin-right';
    const styleValue = '64px';

    if (this.foldedInput()) {
      this.fold();
      this._renderer.setStyle(sibling, styleRule, styleValue, RendererStyleFlags2.Important);
      this._renderer.addClass(this._elementRef.nativeElement, 'folded');
    } else {
      this.unfold();
      if (sibling) {
        this._renderer.removeStyle(sibling, styleRule);
      }
      this._renderer.removeClass(this._elementRef.nativeElement, 'folded');
    }
  }

  /**
   * Setup the visibility of the sidebar
   *
   * @private
   */
  private _setupVisibility(): void {
    // Remove the existing box-shadow
    this._renderer.setStyle(this._elementRef.nativeElement, 'box-shadow', 'none');

    // Make the sidebar invisible
    this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
  }

  /**
   * Setup the sidebar position
   *
   * @private
   */
  private _setupPosition(): void {
    // Add the correct class name to the sidebar
    // element depending on the position attribute
    if (this.position() === 'right') {
      this._renderer.addClass(this._elementRef.nativeElement, 'right-positioned');
    } else {
      this._renderer.addClass(this._elementRef.nativeElement, 'left-positioned');
    }
  }

  /**
   * Setup the lockedOpen handler
   *
   * @private
   */
  private _setupLockedOpen(): void {
    // Return if the lockedOpen wasn't set
    if (!this.lockedOpen()) {
      // Return
      return;
    }

    // Set the wasActive for the first time
    this._wasActive = false;

    // Set the wasFolded
    this._wasFolded = this.folded();

    // Show the sidebar
    this._showSidebar();

    // Act on every media change
    this._bcnMatchMediaService.onMediaChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      // Get the active status
      const isActive = this.isLockedOpen;

      // If the both status are the same, don't act
      if (this._wasActive === isActive) {
        return;
      }

      // Activate the lockedOpen
      if (isActive) {
        // Set the lockedOpen status
        this.isLockedOpen = true;

        // Show the sidebar
        this._showSidebar();

        // Force the the opened status to true
        this.opened = true;

        // If the sidebar was folded, forcefully fold it again
        if (this._wasFolded) {
          // Enable the animations
          this._enableAnimations();

          // Fold
          this.folded.set(true);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        }

        // Hide the backdrop if any exists
        this._hideBackdrop();
      }
      // De-Activate the lockedOpen
      else {
        // Set the lockedOpen status
        this.isLockedOpen = false;

        // Unfold the sidebar in case if it was folded
        this.unfold();

        // Force the the opened status to close
        this.opened = false;

        // Hide the sidebar
        this._hideSidebar();
      }

      // Store the new active status
      this._wasActive = isActive;
    });
  }

  /**
   * Setup the initial folded status
   *
   * @private
   */
  private _setupFolded(): void {
    // Return, if sidebar is not folded
    if (!this.folded) {
      return;
    }

    // Return if the sidebar is closed
    if (!this.opened) {
      return;
    }

    // Programmatically add/remove margin to the element
    // that comes after or before based on the position
    let sibling, styleRule;

    const styleValue = '64px';

    // Get the sibling and set the style rule
    if (this.position() === 'left') {
      sibling = this._elementRef.nativeElement.nextElementSibling;
      styleRule = 'margin-left';
    } else {
      sibling = this._elementRef.nativeElement.previousElementSibling;
      styleRule = 'margin-right';
    }

    // If there is no sibling, return...
    if (!sibling) {
      return;
    }

    // Fold the sidebar
    this.fold();

    // Set the style and class
    this._renderer.setStyle(
      sibling,
      styleRule,
      styleValue,
      RendererStyleFlags2.Important + RendererStyleFlags2.DashCase,
    );
    this._renderer.addClass(this._elementRef.nativeElement, 'folded');
  }

  /**
   * Show the backdrop
   *
   * @private
   */
  private _showBackdrop(): void {
    // Create the backdrop element
    this._backdrop = this._renderer.createElement('div');

    // Add a class to the backdrop element
    this._backdrop.classList.add('bcn-sidebar-overlay');

    // Add a class depending on the invisibleOverlay option
    if (this.invisibleOverlay()) {
      this._backdrop.classList.add('bcn-sidebar-overlay-invisible');
    }

    // Append the backdrop to the parent of the sidebar
    this._renderer.appendChild(this._elementRef.nativeElement.parentElement, this._backdrop);

    // Create the enter animation and attach it to the player
    this._player = this._animationBuilder.build([animate('300ms ease', style({ opacity: 1 }))]).create(this._backdrop);

    // Play the animation
    this._player.play();

    // Add an event listener to the overlay
    this._backdrop.addEventListener('click', () => {
      this.close();
    });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Hide the backdrop
   *
   * @private
   */
  private _hideBackdrop(): void {
    if (!this._backdrop) {
      return;
    }

    // Create the leave animation and attach it to the player
    this._player = this._animationBuilder.build([animate('300ms ease', style({ opacity: 0 }))]).create(this._backdrop);

    // Play the animation
    this._player.play();

    // Once the animation is done...
    this._player.onDone(() => {
      // If the backdrop still exists...
      if (this._backdrop) {
        // Remove the backdrop
        this._backdrop.parentNode.removeChild(this._backdrop);
        this._backdrop = null;
      }
    });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Change some properties of the sidebar
   * and make it visible
   *
   * @private
   */
  private _showSidebar(): void {
    // Remove the box-shadow style
    this._renderer.removeStyle(this._elementRef.nativeElement, 'box-shadow');

    // Make the sidebar invisible
    this._renderer.removeStyle(this._elementRef.nativeElement, 'visibility');

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Change some properties of the sidebar
   * and make it invisible
   *
   * @private
   */
  private _hideSidebar(delay = true): void {
    const delayAmount = delay ? 300 : 0;

    // Add a delay so close animation can play
    setTimeout(() => {
      // Remove the box-shadow
      this._renderer.setStyle(this._elementRef.nativeElement, 'box-shadow', 'none');

      // Make the sidebar invisible
      this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
    }, delayAmount);

    // Mark for check
    this._changeDetectorRef.markForCheck();
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
   * Open the sidebar
   */
  open(): void {
    if (this.opened || this.isLockedOpen) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Show the sidebar
    this._showSidebar();

    // Show the backdrop
    this._showBackdrop();

    // Set the opened status
    this.opened = true;

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Close the sidebar
   */
  close(): void {
    if (!this.opened || this.isLockedOpen) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Hide the backdrop
    this._hideBackdrop();

    // Set the opened status
    this.opened = false;

    // Hide the sidebar
    this._hideSidebar();

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggle open/close the sidebar
   */
  toggleOpen(): void {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Mouseenter
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    // Only work if the sidebar is folded
    if (!this.folded) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Unfold the sidebar temporarily
    this.unfolded = true;

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Mouseleave
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    // Only work if the sidebar is folded
    if (!this.folded) {
      return;
    }

    // Enable the animations
    this._enableAnimations();

    // Fold the sidebar back
    this.unfolded = false;

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

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
    this.folded.set(true);

    // Mark for check
    this._changeDetectorRef.markForCheck();
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
    this.folded.set(false);

    // Mark for check
    this._changeDetectorRef.markForCheck();
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
