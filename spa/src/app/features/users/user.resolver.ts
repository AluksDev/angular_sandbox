import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { APIUser } from '@api/users/DTOs/user.interace';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<any> {
    userService = inject(UserService);
    router = inject(Router);
    resolve(route: ActivatedRouteSnapshot): Observable<APIUser>{
        const id = Number(route.paramMap.get('id'));
        return this.userService.getUserById(id).pipe(
            catchError((err)=>{
                if (err.status === 404){
                    this.router.navigate(['/404'], {
                        queryParams: {returnUrl: '/users'}
                    });
                }
                return EMPTY;
            })
        );
    }
}