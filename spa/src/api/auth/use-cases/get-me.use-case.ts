import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthRepository } from "../repository/auth.repository";
import { User } from "@api/users/DTOs/user.interace";

@Injectable({
  providedIn: "root",
})
export class GetMeUseCase {
  private authRepository = inject(AuthRepository);

  execute(): Observable<APIUser> {
    return this.authRepository.getMe();
  }
}