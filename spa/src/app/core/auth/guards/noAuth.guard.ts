import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@utils/components/dialog.component/dialog.component';


/**
 *  Guard que protege rutas privadas. Solo permite el acceso si el usuario está autenticado.
 * 
 * @param route - La configuración de ruta que se intenta cargar.
 * @param segments - La configuración de ruta que se intenta cargar.
 * @returns `true` si el usuario está logeado y su token es válido de lo contrario, `false`.
 */

export const NotAuthenticatedGuard: CanMatchFn = async(
    route: Route,
    segments: UrlSegment[],
) => {
    
    const authService = inject(AuthService);
    const router = inject(Router);
    const dialog = inject(MatDialog);

    const isAuthenticated = await firstValueFrom( authService.checkStatus() );
    

    if ( authService.authStatus() == 'expired' ) {
        
        const targetUrl = segments['url'];

        dialog.open(DialogComponent, {
            width: '350px',
            data: {
            title: '¡Sesión expirada!',
            success: false,
            message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente'
            }
        });
        
        router.navigate(['/auth'], {
            queryParams: {
                returnUrl: targetUrl
            }
        });
        return false;
    }

    if ( !isAuthenticated.success ) {
        router.navigate(['/auth']);
        return false;
    }


    return true;
}