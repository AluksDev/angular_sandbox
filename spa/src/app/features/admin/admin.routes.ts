import { Routes } from "@angular/router";
import { UserCreateDialogPage } from "./pages/user-create-dialog-page/user-create-dialog-page";
import { adminGuard } from "@app/core/auth/guards/admin.guard";

export const adminRoutes: Routes = [
    {
    path: "",
    canActivate: [adminGuard],
    children: [
      {
        path: "users",
        children: [
            {
                path: 'create',
                component: UserCreateDialogPage
            }
        ]
      }
    ]
  }
]

export default adminRoutes