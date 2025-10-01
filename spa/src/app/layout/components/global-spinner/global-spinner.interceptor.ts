import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { GlobalSpinnerService } from './global-spinner.service';

@Injectable({ providedIn: 'root' })
export class GlobalSpinnerInterceptor implements HttpInterceptor {
  private globalSpinnerService = inject(GlobalSpinnerService);

  activeRequests = 0;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.activeRequests > 0) {
      this.globalSpinnerService.startLoading();
    }

    if (['POST', 'PATCH', 'PUT'].includes(request.method)) {
      this.activeRequests++;
      this.globalSpinnerService.startLoading();

      return next.handle(request).pipe(
        finalize(() => {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.globalSpinnerService.stopLoading();
          }
        }),
      );
    } else {
      return next.handle(request);
    }
  }
}
