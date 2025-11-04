import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, of, ReplaySubject, map, catchError, timeout, tap } from "rxjs";

import { User } from "@api/defs/User";
import { RuntimeConfigService } from "../../../runtime-config.service";
import { environment } from "environments/environment.hmr";
import { AuthResponse } from "../interfaces/auth-response.interface";
import { StorageService } from "./storage.service";

const baseUrl = environment.apiUrl;
const apiTimeout = environment.API_TIMEOUT;


/**
 * Represents a standard response structure from the API.
 */

interface Response {
  success: boolean,
  message?: string,  
}

interface UserRegistration {
  username : string,
  email: string,
  password: string,
  password_confirm: string,
  first_name: string,
  last_name: string,
  department: number
}

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated' | 'expired'

/**
 * Auth service to handle user authentication
 */

@Injectable({
  providedIn: "platform",
})
export class AuthService {
  
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private _authStatus = signal('checking');
  private _user = signal<User|null>(null);

  
  
  private config = inject(RuntimeConfigService);
  private snackBar = inject(MatSnackBar);
  public whoami$: Observable<any>;
  
  public impersonatedRole = null;
  expiryTime: any;
  whoamiSubject = new ReplaySubject<any>(1);
  currentUserSubject = new ReplaySubject<User>(1);
  
  
  user = computed<User|null>(() => this._user() );
  authStatus = computed<AuthStatus>(() => {
        if ( this._authStatus() == 'checking') return 'checking';
        if ( this._authStatus() == 'expired') return 'expired';

        if ( this.user() ){
            return 'authenticated';
        }

        return 'not-authenticated'
    } );


  /**
   * Check the user current status
   * 
   * @returns An observable with the state
   */

  checkStatus():Observable<Response> {
      const token = this.storageService.getAccessToken();

      if ( !token ) {
          this.clear();
          return of({
            success: false,
            message: 'Token inválido'
          });
      }
      

      return this.http.get<User>(`${ baseUrl }/v1/auth/me`,{
      }).pipe(
          timeout(apiTimeout),
          map( user => this.handleAuthSuccess({token, user})),
          catchError((error:any) => this.handleAuthError(error))
      )
  }


  /**
   * Login the user
   * 
   * @param username
   * @param password
   * @returns an observable with the state
   */

  
  login(username: string, password: string): Observable<Response> {

    this.clear();

    return this.http.post<AuthResponse>(`${baseUrl}/v1/auth/login/`, {
      username: username,
      password: password
    }).pipe(
      timeout(apiTimeout),
      map( resp => this.handleAuthSuccess(resp)),
      catchError((error:any) => this.handleAuthError(error))
    );


  }

  /**
   * Register a user
   * @param data The new user data
   * @returns 
   */
  register(data: UserRegistration): Observable<void> {
    
    const {
      username, 
      password, 
      password_confirm, 
      email, 
      first_name,
      last_name,
      department
    } = data

    return this.http.post<void>(`${baseUrl}/v1/auth/register/`, {
      username, 
      password, 
      password_confirm, 
      email, 
      first_name,
      last_name,
      department
    }).pipe(
      timeout(apiTimeout),

      //TODO navegar a la pagina de detalles de usuario
      //TODO mostar error con snackbar
      // tap((resp) => console.log(resp)),
      // catchError((error:any) => this.handleAuthError(error))
    );

    
    
  }

  /**
 * Logs out the current user by sending a POST request to the authentication endpoint.
 */

  logout(){
    
    return this.http.post(`${baseUrl}/v1/auth/logout/`,null).pipe(
      map(resp => {
        this.clear();
        return {
          success: true,
        }
      })
    )
  }

  /**
   * Clear the info storaged
   */
  private clear(){
    this.storageService.clearAll();
    this._authStatus.set('not-authenticated');
    this._user.set(null);
  }

  /**
   * Handle a success auth request 
   * @param param0 
   * @returns an observable with the state
   */

  private handleAuthSuccess({token, user } :AuthResponse) {    
    
    this.storageService.setUser(user);
    this._user.set(user);

    this.storageService.setAccessToken(token);
    this._authStatus.set('authenticated');

    const response: Response = {
      success: true,
    };

    return (response);
  }

  /**
   * Handle an error auth request 
   * @param error - servers's error
   * @returns 
   */
  private handleAuthError( error: any) {
    if ( error.status == 400 ){
      const response: Response = {
        success: false,
        message: error.error.non_field_errors[0]
      };
      
      return of(response);
    }
    
    this.clear();
    
    if ( error.status == 401){

      this._authStatus.set('expired');

      const response: Response = {
        success: false,
        message: "Tu sesión ha expirado. Por favor inicia sesión nuevamente"
      };
      
      return of(response);
    }


    const response: Response = {
      success: false,
      message: "No se pudo conectar con el servidor. Intenta nuevamente"
    };

    return of(response);
  }

  

  /** Inserted by Angular inject() migration for backwards compatibility */
  // constructor(...args: unknown[]);
  // constructor() {
  //   this.whoami$ = this.whoamiSubject.asObservable();
  //   this.currentUser$ = this.currentUserSubject.asObservable();
  // }
  

  patchUser(lopd_accepted: boolean) {
    // TODO: Implement when API client is available
    return of({} as User);
  }

  setRole(role: string): void {
    if (role) {
      this.impersonatedRole = [role];
    } else {
      this.impersonatedRole = null;
    }
  }

  isAllowed(services: [any] | object): Observable<boolean> {
    // TODO: Implement when API client is available
    return of(true);
  }

  randomAlphaNumeric(length: number): string {
    let s = "";
    Array.from({ length }).some(() => {
      s += Math.random().toString(36).slice(2);
      return s.length >= length;
    });
    return s.slice(0, length);
  }
  redirectIDP(): void {
    // TODO: Implement IDP redirect
  }

  logoutIDP(): void {
    localStorage.removeItem("codeVerifier");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("idToken");
  }

  getRefreshToken(): void {
    // TODO: Implement token refresh
  }

  forgotPassword(form: any): Observable<any>{
    //TODO implementar
    return of({});
  }

}
