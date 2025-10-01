import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlerService {
  handleError(error: any, source: string) {
    console.error(`Error in ${source}:`, error);
    return throwError(() => new Error(`Error in ${source}: ${error.message || error}`));
  }
}
