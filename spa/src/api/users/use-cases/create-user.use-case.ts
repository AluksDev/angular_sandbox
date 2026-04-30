import { Observable } from "rxjs";
import { APIUser } from "../DTOs/user.interace";
import { inject, Injectable } from "@angular/core";
import { UserRepository } from "../repository/user.repository";


@Injectable({providedIn: 'root'})
export class CreateUserUseCase {
    userRepository = inject(UserRepository);
    
    execute(userData: APIUser & { password:string, password_confirm: string }): Observable<APIUser> {
        return this.userRepository.createUser(userData);
    }
}