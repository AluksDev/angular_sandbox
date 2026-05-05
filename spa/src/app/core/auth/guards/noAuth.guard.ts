import { inject } from "@angular/core";
import { CanActivateFn, CanMatchFn, Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { map } from "rxjs";

export const noAuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.currentUser$.pipe(
        map(user => {
            if (user){
                return router.createUrlTree(['/dashboard']);
            }
            return true;
        })
    )
}