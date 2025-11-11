import { Routes } from "@angular/router";
import { Error404Component } from "@modules/error404/error404.component";
import { ListUsersComponent } from "./list-users/list-users.component";
import UserDetailComponent from "./user-detail/user-detail.component";
import { AdminGuard } from "@app/core/auth/guards/admin.guard";
import { UserService } from "@app/services/user.service";




export const usersRoutes: Routes = [


    {
        path:'',
        data: { breadcrumb: 'Users' },
        children: [
            {
                path:'',
                canActivate: [AdminGuard],
                component: ListUsersComponent,
            },
            {
                path:':id',
                canActivate: [AdminGuard],
                loadComponent: () => UserDetailComponent,
                data: { breadcrumb: (data: any) => `${data.user.first_name}` }, // dynamic
                resolve: { user: UserService },
            },

              
            { 
                path: "**", 
                loadComponent: () => Error404Component
            },
            
        ]
    }

]

export default usersRoutes;