import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { APILogoutResponse, ApiUserRegister } from "@api/auth/DTOs/auth.interface";
import { LoginUseCase } from "@api/auth/use-cases/login.use-case";
import { GetMeUseCase } from "@api/auth/use-cases/get-me.use-case";
import { LogoutUseCase } from "@api/auth/use-cases/logout.use-case";
import { RegistertUseCase } from "@api/auth/use-cases/register.use-case";
import { APIUser, User } from "@api/users/DTOs/user.interace";


@Injectable({
  providedIn: "platform",
})
export class AuthService {
  constructor(){
    if(this.isAuthenticated()){
      this.getMe().subscribe((user) => {
        this.setCurrentUser(user);
      }
      )
    }
  }

  private currentUserSubject = new BehaviorSubject<APIUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  setCurrentUser(user: APIUser) {
    this.currentUserSubject.next(user);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    return localStorage.getItem("token");
  }


  private loginUseCase = inject(LoginUseCase);
  loginUser(body: any): Observable<{token: string; user: APIUser}> {
    return this.loginUseCase.execute(body).pipe(
      tap((response) => {
              localStorage.setItem("token", response.token);
              this.currentUserSubject.next(response.user);
          })
    );
  }

  private getMeUseCase = inject(GetMeUseCase);
  getMe(): Observable<APIUser> {
    return this.getMeUseCase.execute();
  }

  private logoutUseCase = inject(LogoutUseCase);
  logout(): Observable<APILogoutResponse> {
    return this.logoutUseCase.execute().pipe(
      tap(()=>{
        localStorage.removeItem("token");
        this.currentUserSubject.next(null)
      })
    );
  }

  registerUseCase = inject(RegistertUseCase)
  registerUser(data: ApiUserRegister): Observable<{token: string; user: APIUser}>{
    return this.registerUseCase.execute(data).pipe(
      tap((response) => {
              localStorage.setItem("token", response.token);
              this.currentUserSubject.next(response.user);
          })
    );
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
