import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APILoginResponse } from "../DTOs/user.interface";

@Injectable({
  providedIn: "root",
})
export class AuthRepository {
  private http = inject(HttpClient);

  login(body: any): Observable<APILoginResponse> {
    return this.http.post<APILoginResponse>(
      "/services/sandbox/auth/login/",
      body
    );
  }
}