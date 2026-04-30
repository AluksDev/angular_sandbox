import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { APILogoutResponse } from "@api/auth/DTOs/auth.interface";
import { LoginUseCase } from "@api/auth/use-cases/login.use-case";
import { GetMeUseCase } from "@api/auth/use-cases/get-me.use-case";
import { LogoutUseCase } from "@api/auth/use-cases/logout.use-case";
import { RegistertUseCase } from "@api/auth/use-cases/register.use-case";
import { APIUser, User } from "@api/users/DTOs/user.interace";
import { filter } from "lodash";


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

  get currentUserSnapshot(): APIUser | null {
    return this.currentUserSubject.value;
  }

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
  registerUser(data: APIUser & {password: string, password_confirm: string}): Observable<{token: string; user: APIUser}>{
    return this.registerUseCase.execute(data).pipe(
      tap((response) => {
              localStorage.setItem("token", response.token);
              this.currentUserSubject.next(response.user);
          })
    );
  }

  clearSession(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }
}
