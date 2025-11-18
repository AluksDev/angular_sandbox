import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@app/core/auth/services/auth.service';
import { ActionService } from '@app/action.service';
import { tap } from 'rxjs/operators';

@Directive({
  selector: '[ifNotAllowed]',
  standalone: true,
})
export class IfNotAllowedDirective {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);
  private actionService = inject(ActionService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  @Input()
  set ifNotAllowed(val: string) {
    const action = this.actionService.getAction(val);
    if (action) {
      this.authService
        .isAllowed(action)
        .pipe(
          tap((isAllowed) => {
            if (isAllowed) {
              this.viewContainer.clear();
            } else {
              this.viewContainer.clear();
              this.viewContainer.createEmbeddedView(this.templateRef);
            }
          }),
        )
        .subscribe();
    } else {
      this.viewContainer.clear();
    }
  }
}
