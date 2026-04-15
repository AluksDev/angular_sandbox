import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "app/core/auth/auth.service";

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();

  if (token) {
    return true;
  }

  return router.parseUrl("/auth/login");
};




// import { inject } from "@angular/core";
// import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
// import { AuthService } from "app/core/auth/auth.service";
// import { of, switchMap, tap } from "rxjs";

// export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
//   const router: Router = inject(Router);
//   const authService: AuthService = inject(AuthService);
//   // Check the authentication status

//   if (!authService.getAccessToken()) {
//     if (localStorage.getItem("refreshToken") && localStorage.getItem("refreshToken") !== "undefined") {
//       authService.getRefreshToken();
//     } else {
//       authService.redirectIDP();
//     }
//   }

//   return authService.currentUser$.pipe(
//     switchMap((user) => {
//       // If the user is not authenticated...
//       if (user) {
//         if (!user.lopd_accepted) {
//           // Redirect to the sign-in page with a redirectUrl param
//           const urlTree = router.parseUrl(`avis-legal`);
//           return of(urlTree);
//         } else {
//           return of(true);
//         }
//       } else {
//         console.log("no user");
//       }

//       // Allow the access
//       return of(true);
//     })
//   );
// };
