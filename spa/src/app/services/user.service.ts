import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { User, UserResponse } from '@api/defs/User';
import { environment } from 'environments/environment.hmr';
import { catchError, map, Observable, of, tap } from 'rxjs';

const baseUrl = environment.apiUrl;

interface Options {
  ordering?: string,
  search?:string,
  last_login?:string,
  last_login_isnull?: string,
  limit?: number,
  offset?: number,
  is_active?: boolean
  department?: number
};

/**
 * Service for interacting with the user-related API endpoints.
 * 
 * Responsibilities:
 * - Fetching paginated user lists
 * - Filtering users based on status or search criteria
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private router = inject(Router);

    /**
   * Fetches a paginated list of users from the API.
   *
   * @param options - Query options for the request:
   *   - `limit`: Number of users per page (default: 10)
   *   - `offset`: Pagination offset (default: 0)
   *   - `search`: Optional search term to filter users (default: empty string)
   *   - `is_active`: If provided, filters users by active status
   *
   * @returns Observable<UserResponse>
   *
   * Notes:
   * - The `total` property is calculated on the client side by dividing
   *   the total `count` by `limit` and rounding up.
   */

  getUsers(options: Options) :Observable<UserResponse> {

    const {limit = 10, offset = 0, search='', is_active = null, department=''} = options;

    return this.http.get<UserResponse>(`${baseUrl}/user`, {
      params:{
        limit,
        offset,
        search,
        is_active,
        department
      }
    }).pipe(
      map(resp => ({
        ...resp,
        total: Math.ceil(resp.count / limit)
      }))
    );

  }

  /**
   * Toggle the field is_active of an user
   * @param user the user to be edited
   * @returns 
   */
  toggleActive(user: User){

    const {id, username, is_active} = user;

    const new_active = !is_active;

    return this.http.put(`${baseUrl}/user/${id}/`, {
      username,
      is_active: new_active
    }).pipe(
      tap(() => {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
        });
      })
    );

  }

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
    return this.http.get<User>(`${baseUrl}/v1/auth/me/`, {
        }).pipe(
          catchError(error => {return of(null)} )
        );
  
  }


  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${baseUrl}/user/${id}`);
  
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    const id = route.params['id'];
     return this.http.get<User>(`${baseUrl}/user/${id}`);
  }


}
