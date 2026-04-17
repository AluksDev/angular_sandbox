import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthRepository } from "../repository/auth.repository";
import { User } from "../DTOs/user.interface";

@Injectable({
  providedIn: "root",
})
export class GetMeUseCase {
  private authRepository = inject(AuthRepository);

  execute(): Observable<User> {
    return this.authRepository.getMe();
  }
}