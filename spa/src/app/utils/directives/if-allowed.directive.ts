import { Directive, effect, inject, Input, isSignal, signal, Signal, TemplateRef, ViewContainerRef } from "@angular/core";
import { ActionService } from "@app/action.service";
import { AuthService } from "@app/core/auth/auth.service";
import { tap } from "rxjs/operators";

@Directive({
  selector: "[ifAllowed]",
})
export class IfAllowedDirective {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);
  private actionService = inject(ActionService);
  private internalIfAllowed = signal<string>("");

  @Input()
  set ifAllowed(val: string) {
    // Si el valor es un string, lo convertimos en un Signal

    const action = this.actionService.getAction(val);
    if (action) {
      this.authService
        .isAllowed(action)
        .pipe(
          tap((isAllowed) => {
            this.viewContainer.clear();
            if (isAllowed) {
              this.viewContainer.createEmbeddedView(this.templateRef);
            } else {
              this.viewContainer.clear();
            }
          })
        )
        .subscribe();
    } else {
      this.viewContainer.clear();
    }
  }

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    effect(() => {
      const val = this.internalIfAllowed();
      const action = this.actionService.getAction(val);

      if (action) {
        this.authService
          .isAllowed(action)
          .pipe(
            tap((isAllowed) => {
              this.viewContainer.clear();
              if (isAllowed) {
                this.viewContainer.createEmbeddedView(this.templateRef);
              } else {
                this.viewContainer.clear();
              }
            })
          )
          .subscribe();
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
