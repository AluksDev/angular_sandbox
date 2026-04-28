import { Observable } from "rxjs";
import { APIUser, CreateUser } from "../DTOs/user.interace";
import { inject, Injectable } from "@angular/core";
import { UserRepository } from "../repository/user.repository";


@Injectable({providedIn: 'root'})
export class CreateUserUseCase {
    userRepository = inject(UserRepository);
    
    execute(userData: CreateUser): Observable<APIUser> {
        return this.userRepository.createUser(userData);
    }
}