import { Routes } from "@angular/router";
import { LoginPage } from "./pages/login-page/login-page";
import { RegisterPage } from "./pages/register-page/register-page";
import { noAuthGuard } from "./guards/noAuth.guard";

export const authRoutes: Routes = [
    {
        path: '',
        canActivate: [noAuthGuard],
        children: [
            {
                path: 'login',
                component: LoginPage
            },
            {
                path: 'register',
                component: RegisterPage
            }
        ]
    }
]

export default authRoutes