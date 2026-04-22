import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { map } from "rxjs";

export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
        map(user => {
            if (!user) {
                return router.createUrlTree(['/auth', 'login']);
            }
            const isAdmin =
                user.roles.includes('admin') ||
                user.roles.includes('superuser');

            if (!isAdmin) {
                return router.createUrlTree(['/']);
            }

            return true; 
        })
    )
}