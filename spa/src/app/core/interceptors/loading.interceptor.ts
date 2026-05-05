import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingService } from "../services/loading.service";
import { finalize } from "rxjs";

export function loadingInterceptor (request: HttpRequest<unknown>, next: HttpHandlerFn){
    const loadingService = inject(LoadingService);

    loadingService.show();

    return next(request).pipe(
        finalize(()=> {
            loadingService.hide()
        })
    );
}