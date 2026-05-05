import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry, throwError, delay } from 'rxjs';
import { NotificationsService } from '../notifications/notification.service';
import { timer } from 'rxjs';

export function errorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const notificationService = inject(NotificationsService);
  const router = inject(Router);
  
  return next(request).pipe(
    retry({
      count: 2,
      delay: (error, retryCount) => {
        if (error.status === 0) {
          return timer(1000 * retryCount);
        }
        throw error;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 0:
          console.error('Network error', error);
          notificationService.error('Network error');
          break;
        case 403:
          console.error('Forbidden');
          notificationService.error('You are not authorised');
          break;
        case 404:
          console.error('Not found', error);
          notificationService.error('Page not found');
          break;
        case 401: 
          console.error('Unauthorized - clearing token');
          notificationService.error('Session expired. Please log in again');
          localStorage.removeItem('token');
          router.navigate(['/']);
          break;
        default:
          if (error.status >= 500) {
            console.error('Server error', error);
            notificationService.error('Something went wrong');
          }
          break;
      }
      return throwError(() => error);
    })
  );
}