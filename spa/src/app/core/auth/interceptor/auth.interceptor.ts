import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, firstValueFrom, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { StorageService } from "../services/storage.service";


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

/**
 * Interceptor that adds the token in authenticated request
 *
 */


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn){

  
  const token = inject(StorageService).getAccessToken();


  if(token){
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Token ${token}`),
    });
    return next(newReq);
  }

  return next(req);
  



}