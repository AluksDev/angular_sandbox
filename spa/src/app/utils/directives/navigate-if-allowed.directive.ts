import { Directive, ElementRef, HostListener, inject, Input, input, Renderer2 } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { ActionService } from '@app/action.service';

import { AuthService } from '../../core/auth/auth.service';

@Directive({
  selector: ':not(a)[navigateIfAllowed]',
})
export class NavigateIfAllowedDirective {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private actionService = inject(ActionService);
  private authService = inject(AuthService);

  queryParams = input<{
    [k: string]: any;
  }>();
  fragment = input<string>();
  preserveFragment = input<boolean>();
  skipLocationChange = input<boolean>();
  replaceUrl = input<boolean>();
  state = input<{
    [k: string]: any;
  }>();

  private commands: any[] = [];
  private preserve: boolean;

  allow = input<string>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    // const tabIndex = inject(new HostAttributeToken('tabindex'));
    const renderer = inject(Renderer2);
    const el = inject(ElementRef);
    const tabIndex = el.nativeElement.getAttribute('tabindex');

    if (tabIndex === null) {
      renderer.setAttribute(el.nativeElement, 'tabindex', '0');
    }
  }

  @Input()
  set navigateIfAllowed(commands: any[] | string) {
    if (commands !== null) {
      this.commands = Array.isArray(commands) ? commands : [commands];
    } else {
      this.commands = [];
    }
  }

  @HostListener('click')
  onClick(): boolean {
    const action = this.actionService.getAction(this.allow());

    if (action) {
      this.authService
        .isAllowed(action)
        .pipe(
          tap((isAllowed) => {
            if (isAllowed) {
              const extras = {
                skipLocationChange: attrBoolValue(this.skipLocationChange()),
                replaceUrl: attrBoolValue(this.replaceUrl()),
              };
              this.router.navigateByUrl(this.urlTree, extras);
              return true;
            } else {
              return false;
            }
          }),
        )
        .subscribe();
    } else {
      return false;
    }
  }

  get urlTree(): UrlTree {
    return this.router.createUrlTree(this.commands, {
      relativeTo: this.route,
      queryParams: this.queryParams(),
      fragment: this.fragment(),
      queryParamsHandling: attrBoolValue(this.preserve) ? 'preserve' : undefined,
      preserveFragment: attrBoolValue(this.preserveFragment()),
    });
  }
}

function attrBoolValue(s: any): boolean {
  return s === '' || !!s;
}
