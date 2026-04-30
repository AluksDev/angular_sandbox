import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  let authReq = request;

  if (token) {
    authReq = request.clone({
      setHeaders: {
        Authorization: `Token ${token}`
      }
    });
  }
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        console.error('Unauthorized - clearing token');
        localStorage.removeItem('token');
        router.navigate(['/']);
      }

      return throwError(() => error);
    })
  );
}