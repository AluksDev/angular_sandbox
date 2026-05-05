import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationsService } from '../notifications/notification.service';

export function errorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const notificationService = inject(NotificationsService);
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
        if (error.status >= 500){
            console.error('Server error', error);
            notificationService.error('Something went wrong');
        } else if (error.status === 0){
            console.error('Network error', error);
            notificationService.error('Network error');
        } else if (error.status === 403){
          console.error('Unauthorized');
          notificationService.error('You are not authorised');
        }
        return throwError(() => error);
    })
  )
}