import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { APILoginResponse, APILogoutResponse, APIUser, User } from "@api/auth/DTOs/user.interface";
import { mapApiUserToUser } from "@app/core/user/user.mapper";
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
}