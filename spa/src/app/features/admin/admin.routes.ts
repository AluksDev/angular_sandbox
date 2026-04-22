import { Routes } from "@angular/router";
import { UserCreateDialogPage } from "./pages/user-create-dialog-page/user-create-dialog-page";

export const adminRoutes: Routes = [
    {
    path: "",
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