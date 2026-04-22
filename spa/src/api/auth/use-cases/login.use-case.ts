import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthRepository } from "../repository/auth.repository";
import { User } from "@api/users/DTOs/user.interace";

@Injectable({
  providedIn: "root",
})
export class LoginUseCase {
  private authRepository = inject(AuthRepository);

  execute(body: any): Observable<{token: string; user: User}> {
    return this.authRepository.login(body);
  }
}