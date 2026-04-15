import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable, of, ReplaySubject } from "rxjs";

import { RuntimeConfigService } from "../../runtime-config.service";
// import { User } from "@api/defs/User";
import { APILoginResponse } from "@api/DTOs/user.interface";
import { LoginUseCase } from "@api/use-cases/login.use-case";

@Injectable({
  providedIn: "platform",
})
export class AuthService {
  private loginUseCase = inject(LoginUseCase);

  loginUser(body: any): Observable<APILoginResponse> {
    return this.loginUseCase.execute(body);
  }

  getAccessToken(): string | null {
    return localStorage.getItem("token");
  }
  
  registerUser(){
    console.log('Register user');
  }













  // private router = inject(Router);
  // private snackBar = inject(MatSnackBar);
  // private config = inject(RuntimeConfigService);
  // public whoami$: Observable<any>;
  // public currentUser$: Observable<User>;
  // public impersonatedRole = null;
  // expiryTime: any;
  // whoamiSubject = new ReplaySubject<any>(1);
  // currentUserSubject = new ReplaySubject<User>(1);
  // /** Inserted by Angular inject() migration for backwards compatibility */
  // constructor(...args: unknown[]);
  // constructor() {
  //   this.whoami$ = this.whoamiSubject.asObservable();
  //   this.currentUser$ = this.currentUserSubject.asObservable();
  // }
  // getUser(): Observable<User> {
  //   // TODO: Implement when API client is available
  //   return of({} as User);
  // }

  // patchUser(lopd_accepted: boolean) {
  //   // TODO: Implement when API client is available
  //   return of({} as User);
  // }

  // setRole(role: string): void {
  //   if (role) {
  //     this.impersonatedRole = [role];
  //   } else {
  //     this.impersonatedRole = null;
  //   }
  // }

  // isAllowed(services: [any] | object): Observable<boolean> {
  //   // TODO: Implement when API client is available
  //   return of(true);
  // }
  // setAccessToken(token: string): void {
  //   localStorage.setItem("accessToken", token);
  // }
  // // getAccessToken(): string {
  // //   return localStorage.getItem("accessToken") && localStorage.getItem("accessToken") !== "undefined" && localStorage.getItem("accessToken") !== "null" ? localStorage.getItem("accessToken") : undefined;
  // // }
  // randomAlphaNumeric(length: number): string {
  //   let s = "";
  //   Array.from({ length }).some(() => {
  //     s += Math.random().toString(36).slice(2);
  //     return s.length >= length;
  //   });
  //   return s.slice(0, length);
  // }
  // redirectIDP(): void {
  //   // TODO: Implement IDP redirect
  // }

  // logoutIDP(): void {
  //   localStorage.removeItem("codeVerifier");
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("idToken");
  // }

  // getToken(code: any): void {
  //   // TODO: Implement token retrieval
  // }

  // getRefreshToken(): void {
  //   // TODO: Implement token refresh
  // }
}
