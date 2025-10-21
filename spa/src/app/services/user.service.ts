import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserResponse } from '@api/defs/User';
import { environment } from 'environments/environment.hmr';
import { map, Observable, tap } from 'rxjs';

const baseUrl = environment.apiUrl;

interface Options {
  ordering?: string,
  search?:string,
  last_login?:string,
  last_login_isnull?: string,
  limit?: number,
  offset?: number,
  is_active?: boolean
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

    const {limit = 10, offset = 0, search='', is_active = null} = options;

    return this.http.get<UserResponse>(`${baseUrl}/user`, {
      params:{
        limit,
        offset,
        search,
        is_active
      }
    }).pipe(
      map(resp => ({
        ...resp,
        total: Math.ceil(resp.count / limit)
      }))
    );

  }

}
