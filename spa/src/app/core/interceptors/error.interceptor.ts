import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export function errorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const router = inject(Router);
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
        switch (error.status){
            case 404:
                router.navigate(['/404']);
                break;
        }
        return throwError(() => error);
    })
  )
}