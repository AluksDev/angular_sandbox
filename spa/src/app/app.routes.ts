import { Route } from "@angular/router";
import { authGuard } from "app/core/auth/guards/auth.guard";
import { UsersListPage } from "./core/users/pages/users-list-page/users-list-page";
import { LandingHomeComponent } from "@modules/landing/home/home.component";

export const appRoutes: Route[] = [
  {
    path: "auth",
    loadChildren: () => import("./core/auth/auth.routes"),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "",
    canActivateChild: [authGuard],
    children: [
      {
        path: "home",
        component: LandingHomeComponent,
      },
      {
        path: "users",
        component: UsersListPage,
      },
    ],
  },
  {
    path: "**",
    redirectTo: "home",
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
