import { Route } from "@angular/router";
import { authGuard } from "app/core/auth/guards/auth.guard";
import { UsersListPage } from "./features/users/pages/users-list-page/users-list-page";
import { DepartmentsPage } from "./features/departments/pages/departments-page/departments-page";
import { UserProfilePage } from "./features/user/pages/user-profile-page/user-profile-page";
import { DashboardPage } from "./features/dashboard/pages/dashboard-page/dashboard-page";
import { adminGuard } from "./core/auth/guards/admin.guard";
import { Forbidden403Page } from "./features/errors/pages/forbidden-403-page/forbidden-403-page";
import { UserDetailsPage } from "./features/user/pages/user-details-page/user-details-page";
import { UserResolver } from "./features/users/user.resolver";
import { NotFound404Page } from "./features/errors/pages/not-found-404-page/not-found-404-page";
import { DepartmentDetailsPage } from "./features/departments/pages/department-details-page/department-details-page";
import { DepartmentResolver } from "./features/departments/department.resolver";
import { EditUserPage } from "./features/user/pages/edit-user-page/edit-user-page";

export const appRoutes: Route[] = [
  {
    path: "auth",
    loadChildren: () => import("./core/auth/auth.routes"),
  },
  {
    path: "admin",
    canActivate: [adminGuard],
    loadChildren: () => import("./features/admin/admin.routes"),
  },
  {
    path: '403',
    component: Forbidden403Page
  },
  {
    path: '404',
    component: NotFound404Page
  },
  {
    path: "",
    canActivateChild: [authGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        component: DashboardPage,
      },
      {
        path: "users",
        children: [
            {
              path: "",
              component: UsersListPage
            },
            {
              path: ":id",
              component: UserDetailsPage,
              resolve: {
                userDetails: UserResolver
              }
            },
            {
              path: ":id/edit",
              component: EditUserPage,
              resolve: {
                userDetails: UserResolver
              }
            }
          ]
      },
      {
        path: 'departments',
        children: [
          {
            path: "",
            component: DepartmentsPage
          },
          {
            path: ":id",
            component: DepartmentDetailsPage,
            resolve: {
              departmentDetails: DepartmentResolver
            }
          }
        ]
        
      },
      {
        path: 'account',
        component: UserProfilePage
      }
    ],
  },
  {
    path: "**",
    component: NotFound404Page,
  },
];
