import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, CanMatchFn, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { map } from "rxjs";

export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUserSnapshot;

    if (!user) {
        return router.createUrlTree(['/auth/login']);
    }

    const roles = user.roles ?? [];

    const isAdmin =
        roles.includes('admin') ||
        roles.includes('superuser');

    return isAdmin
        ? true
        : router.createUrlTree(['/403']);
}