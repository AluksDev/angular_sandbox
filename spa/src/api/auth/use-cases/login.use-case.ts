import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthRepository } from "../repository/auth.repository";
import { APILoginResponse } from "../DTOs/user.interface";

@Injectable({
  providedIn: "root",
})
export class LoginUseCase {
  private authRepository = inject(AuthRepository);

  execute(body: any): Observable<APILoginResponse> {
    return this.authRepository.login(body).pipe(
      tap((response) => {
        localStorage.setItem("token", response.token);
      })
    );
  }
}