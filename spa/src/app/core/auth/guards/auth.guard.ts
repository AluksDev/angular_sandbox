// import { inject } from "@angular/core";
// import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
// import { AuthService } from "@app/core/auth/guards/services/auth.service";
// import { of, switchMap, tap } from "rxjs";

// export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
//   const router: Router = inject(Router);
//   const authService: AuthService = inject(AuthService);
//   // Check the authentication status

//   if (!authService.getAccessToken()) {
//     console.log("no hay token");
    
//     if (localStorage.getItem("refreshToken") && localStorage.getItem("refreshToken") !== "undefined") {
//       authService.getRefreshToken();
//     } else {
//       console.log("no hay refres token");
      
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

//   // const isAuth





// };
