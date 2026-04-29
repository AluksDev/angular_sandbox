import { Route } from "@angular/router";
import { authGuard } from "app/core/auth/guards/auth.guard";
import { UsersListPage } from "./features/users/pages/users-list-page/users-list-page";
import { DepartmentsPage } from "./features/departments/pages/departments-page/departments-page";
import { UserProfilePage } from "./features/user/pages/user-profile-page/user-profile-page";
import { DashboardPage } from "./features/dashboard/pages/dashboard-page/dashboard-page";
import { adminGuard } from "./core/auth/guards/admin.guard";
import { noAuthGuard } from "./core/auth/guards/noAuth.guard";
import { Forbidden403Page } from "./features/errors/pages/forbidden-403-page/forbidden-403-page";
import { UserDetailsPage } from "./features/user/pages/user-details-page/user-details-page";
import { UserResolver } from "./features/users/user.resolver";
import { NotFound404Page } from "./features/errors/pages/not-found-404-page/not-found-404-page";
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
        component: DepartmentsPage
      },
      {
        path: 'account',
        component: UserProfilePage
      }
    ],
  },
  {
    path: "**",
    redirectTo: "",
  },
];

// export const appRoutes: Route[] = [
//   {
//     path: 'auth',
//     loadChildren: () => import('./core/auth/auth.routes')
//   },
//   {
//     path: 'users',
//     component: UsersListPage
//   },
//   // Redirect empty path to '/example'
//   { path: "", pathMatch: "full", redirectTo: "home" },
//   {
//     path: "403",
//     loadComponent: () => import("@modules/error403/error403.component").then((m) => m.Error403Component),
//   },
//   {
//     path: "404",
//     loadComponent: () => import("@modules/error403/error403.component").then((m) => m.Error403Component),
//   },
//   {
//     path: "",
//     // canActivate: [AuthGuard],
//     // canActivateChild: [AuthGuard],
//     loadComponent: () => import("app/layout/layout.component").then((m) => m.LayoutComponent),
//     resolve: {
//       // initialData: initialDataResolver,
//     },
//     children: [
//       {
//         path: "home",
//         loadChildren: () => import("app/modules/landing/home/home.routes"),
//       },
//       { path: "**", redirectTo: "home" },
//     ],
//   },
// ];
