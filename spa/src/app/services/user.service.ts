import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserResponse } from '@api/defs/User';
import { environment } from 'environments/environment.hmr';
import { delay, map, Observable, tap } from 'rxjs';

const baseUrl = environment.apiUrl;

interface Options {
  ordering?: string,
  search?:string,
  last_login?:string,
  last_login_isnull?: string,
  limit?: number,
  offset?: number,
};


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);



  getUsers(options: Options) :Observable<UserResponse> {

    const {limit = 10, offset = 0} = options;

    return this.http.get<UserResponse>(`${baseUrl}/user`, {
      params:{
        limit,
        offset
      }
    }).pipe(
      map(resp => ({
        ...resp,
        total: Math.ceil(resp.count / limit)
      }))
    );

  }

}
