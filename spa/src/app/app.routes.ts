import { Route } from "@angular/router";
import { authGuard } from "app/core/auth/guards/auth.guard";
import { UsersListPage } from "./core/users/pages/users-list-page/users-list-page";
import { LandingHomeComponent } from "@modules/landing/home/home.component";
import { DepartmentsPage } from "./features/departments/pages/departments-page/departments-page";
import { UserProfilePage } from "./features/user/pages/user-profile-page/user-profile-page";
import { DashboardPage } from "./features/dashboard/pages/dashboard-page/dashboard-page";

export const appRoutes: Route[] = [
  {
    path: "auth",
    loadChildren: () => import("./core/auth/auth.routes"),
  },
  {
    path: "",
    canActivateChild: [authGuard],
    children: [
      {
        path: "",
        component: DashboardPage,
      },
      {
        path: "users",
        component: UsersListPage,
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
