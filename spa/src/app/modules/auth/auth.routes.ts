import { Routes } from "@angular/router";
import { AuthenticatedGuard } from "@app/core/auth/guards/auth.guard";



export const authRoutes: Routes = [


    {
        path:'',
        canActivate: [AuthenticatedGuard],
        canActivateChild: [AuthenticatedGuard],
        children: [
            {
                path:'sign-in',
                loadChildren: () => import('./sign-in/sign-in.routes')
            },

            {
                path:'sign-up',
                loadChildren: () => import('./sign-up/sign-up.routes')
            },

            {
                path:'forgot-password',
                loadChildren: () => import('./forgot-password/forgot-password.routes')
            },

              
            { 
                path: "**", 
                redirectTo: "sign-in" 
            },
            
        ]
    }

]

export default authRoutes;