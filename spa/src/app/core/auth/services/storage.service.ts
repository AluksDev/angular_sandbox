import { computed, Injectable, signal } from '@angular/core';
import { User } from "@api/defs/User";
import { Observable, of } from 'rxjs';


/**
 * Store management service
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Set the auth_token in localSotrage
   * @param token new token
   */
  setAccessToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  /**
   * Get the value of auth_token in localSotrage
   * @returns
   */

  getAccessToken(): string {
    return localStorage.getItem("auth_token") && localStorage.getItem("auth_token") !== "undefined" && localStorage.getItem("auth_token") !== "null" ? localStorage.getItem("auth_token") : undefined;
  }

  /**
   * Resets the token
   */
  clearToken(){
    this.setAccessToken(null);
  }

  /**
   * Set the user in sesionSotrage
   * @param user new user
   */
  setUser( user: User ){
    sessionStorage.setItem("user", user ? JSON.stringify(user) : null);
  }

  /**
   * Get the user in sesionSotrage
   */
  getUser(): User {
    return sessionStorage.getItem("user") && sessionStorage.getItem("user") !== "undefined" && sessionStorage.getItem("user") !== "null" ? JSON.parse(sessionStorage.getItem("user")) : undefined;

  }

  /**
   * Reset the user and token value in storage
   */
  clearAll(){
    this.clearToken();
    this.setUser(null);
  }

}
