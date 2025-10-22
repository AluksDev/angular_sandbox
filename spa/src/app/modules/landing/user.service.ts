import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@api/defs/User';
import { environment } from 'environments/environment.hmr';
import { catchError, Observable, of } from 'rxjs';

const baseUrl = environment.apiUrl;

/**
 * Service for managing user-related API operations.
 * Provides methods for fetching user data.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  _httpClient = inject(HttpClient);

  /**
   * Fetches the profile information of the currently authenticated user.
   *
   * @remarks
   * This method performs a GET request to the `/v1/auth/me/` endpoint.
   *
   * @returns An `Observable<User>` that emits the user's profile
   * data upon success.
   */
  get(): Observable<User> {
    return this._httpClient.get<User>(`${baseUrl}/v1/auth/me/`, {
        }).pipe(
          catchError(error => {return of(null)} )
        );
  
  }

}
