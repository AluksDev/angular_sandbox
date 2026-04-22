import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { APILoginResponse, APILogoutResponse, ApiUserRegister } from "@api/auth/DTOs/auth.interface";
import { mapApiUserToUser } from "@app/core/user/user.mapper";
import { APIUser, User } from "@api/users/DTOs/user.interace";
@Injectable({
  providedIn: "root",
})
export class AuthRepository {
  private http = inject(HttpClient);

  login(body: any): Observable<{token: string; user: User}> {
    return this.http.post<APILoginResponse>("/services/sandbox/auth/login/", body).pipe(
      map((res) =>( {
        token: res.token,
        user: mapApiUserToUser(res.user)
      }))
    );
  }

  getMe(): Observable<User> {
    return this.http.get<APIUser>("/services/sandbox/auth/me/").pipe(
      map((apiUser)=> mapApiUserToUser(apiUser))
    )
  }

  logout(): Observable<APILogoutResponse>{
    return this.http.post<APILogoutResponse>("/services/sandbox/auth/logout/", {});
  }

  register(body: ApiUserRegister): Observable<{token: string; user: User}> {
    return this.http.post<APILoginResponse>("/services/sandbox/auth/register/", body).pipe(
      map((res) =>( {
        token: res.token,
        user: mapApiUserToUser(res.user)
      }))
    );
  }
}