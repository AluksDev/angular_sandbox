import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  let authReq = request;

  if (token) {
    authReq = request.clone({
      setHeaders: {
        Authorization: `Token ${token}`
      }
    });
  }
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        console.error('Unauthorized - clearing token');
        localStorage.removeItem('token');
        router.navigate(['/']);
      }

      return throwError(() => error);
    })
  );
}

















// import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
// import { inject } from "@angular/core";
// import { Router } from "@angular/router";
// import { catchError, throwError } from "rxjs";

// // @Injectable({ providedIn: "root" })
// // export class AuthInterceptor implements HttpInterceptor {
// //   private runtimeEnvironment = inject(RuntimeConfigService);
// //   private router = inject(Router);

// //   /** Inserted by Angular inject() migration for backwards compatibility */
// //   constructor(...args: unknown[]);

// //   // expiryTime: Timer;

// //   constructor() {}

// //   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
// //     let headers = request.headers.set("Accept-Language", "ca");
// //     if (localStorage.getItem("accessToken")) {
// //       headers = headers.set("Authorization", "Bearer " + localStorage.getItem("accessToken"));
// //     }

// //     // If "internal" header 'X-Skip-AuthInterceptor' is present, don't add 'x-ibm-client-id' (used to prevent
// //     // cyclic dependency when loading the JSON with th client-id)
// //     if (!request.headers.has("X-Skip-AuthInterceptor")) {
// //       headers = headers.set("x-ibm-client-id", this.runtimeEnvironment?.config["x-ibm-client-id"]);
// //     }

// //     // Delete "internal" header 'X-Skip-AuthInterceptor'
// //     headers = headers.delete("X-Skip-AuthInterceptor");

// //     if (request.url.includes("token")) {
// //       headers = headers.delete("x-ibm-client-id");
// //     }

// //     // Clone the request to add the new headers
// //     request = request.clone({ headers });
// //     console.log("interceptor", request);
// //     console.log("interceptor", next);
// //     // Pass the cloned request instead of the original request to the next handle
// //     return next.handle(request).pipe(
// //       catchError((err) => {
// //         console.log("interceptor error", err);
// //         if (err instanceof HttpErrorResponse) {
// //           if (err.status === 401 || err.statusText === "Unauthorized") {
// //             localStorage.removeItem("codeVerifier");
// //             localStorage.removeItem("accessToken");
// //             localStorage.removeItem("refreshToken");
// //             localStorage.removeItem("idToken");
// //             window.location.reload();
// //           } else if (err.status === 403) {
// //             this.router.navigate(["/403"]);
// //           } else if (err.status === 404) {
// //             // NO OP (?)
// //           } else if (err.status === 0) {
// //             // This is a failed OPTIONS error (CORS?)
// //             // NO OP (?)
// //           } else if (err.url === null || err.statusText === "Unknown Error" || err.statusText === "Unauthorized") {
// //             window.location.reload();
// //           }
// //         }
// //         return throwError(() => err);
// //       })
// //     );
// //   }
// // }

// export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
//   // Inject the current `AuthService` and use it to get an authentication token:
//   const router = inject(Router);

//   let headers = request.headers.set("Accept-Language", "ca");
//   if (localStorage.getItem("accessToken")) {
//     headers = headers.set("Authorization", "Bearer " + localStorage.getItem("accessToken"));
//   }

//   // If "internal" header 'X-Skip-AuthInterceptor' is present, don't add 'x-ibm-client-id' (used to prevent
//   // cyclic dependency when loading the JSON with th client-id)

//   // Skip x-ibm-client-id header for now (not configured in environment)

//   // Delete "internal" header 'X-Skip-AuthInterceptor'
//   headers = headers.delete("X-Skip-AuthInterceptor");

//   if (request.url.includes("token")) {
//     headers = headers.delete("x-ibm-client-id");
//     headers = headers.delete("Authorization");
//   }

//   // Clone the request to add the new headers
//   request = request.clone({ headers });
//   // Pass the cloned request instead of the original request to the next handle
//   return next(request).pipe(
//     catchError((err) => {
//       if (err instanceof HttpErrorResponse) {
//         if (err.status === 401 || err.statusText === "Unauthorized") {
//           localStorage.removeItem("accessToken");
//           localStorage.removeItem("refreshToken");
//           router.navigate(["/"]);
//         } else if (err.status === 403) {
//           router.navigate(["/403"]);
//         } else if (err.status === 404) {
//           router.navigate(["/404"]);
//         } else if (err.status === 0) {
//           // This is a failed OPTIONS error (CORS?)
//           // NO OP (?)
//         } else if (err.url === null || err.statusText === "Unknown Error" || err.statusText === "Unauthorized") {
//           // localStorage.removeItem("codeVerifier");
//           // localStorage.removeItem("accessToken");
//           // localStorage.removeItem("refreshToken");
//           // localStorage.removeItem("idToken");
//           // window.location.reload();
//         }
//       }
//       return throwError(() => err);
//     })
//   );
// }
