import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthRepository } from "../repository/auth.repository";
import { APIUser, User } from "@api/users/DTOs/user.interace";

@Injectable({
  providedIn: "root",
})
export class LoginUseCase {
  private authRepository = inject(AuthRepository);

  execute(body: any): Observable<{token: string; user: APIUser}> {
    return this.authRepository.login(body);
  }
}