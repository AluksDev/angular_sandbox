import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { StorageService } from '../services/storage.service';


/**
 *  Guard que protege rutas privadas. Solo permite el acceso si el usuario está autenticado.
 * 
 * @param route - La configuración de ruta que se intenta cargar.
 * @param segments - La configuración de ruta que se intenta cargar.
 * @returns `true` si el usuario está logeado y su token es válido de lo contrario, `false`.
 */

export const NotAuthenticatedGuard: CanMatchFn = async(
    route: Route,
    segments: UrlSegment[]
) => {
    
    const authService = inject(AuthService);
    const storageService = inject(StorageService);
    const router = inject(Router);

    const isAuthenticated = await firstValueFrom( authService.checkStatus() );
    

    if ( authService.authStatus() == 'expired' ) {
        router.navigate(['/auth'], { queryParams: { reason: 'expired' } });
        return false;
    }

    if ( !isAuthenticated.success ) {
        router.navigate(['/auth']);
        return false;
    }


    return true;
}