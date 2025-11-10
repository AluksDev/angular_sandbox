import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserResponse } from '@api/defs/User';
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

  
  getUser(options: Options) :Observable<UserResponse> {

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

}
