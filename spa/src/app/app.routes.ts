import { Route } from "@angular/router";
import { AuthGuard } from "app/core/auth/guards/auth.guard";
import { UsersListPage } from "./core/users/pages/users-list-page/users-list-page";

// @formatter:off

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('./core/auth/auth.routes')
  },
  {
    path: 'users',
    component: UsersListPage
  },
  // Redirect empty path to '/example'
  { path: "", pathMatch: "full", redirectTo: "home" },
  {
    path: "403",
    loadComponent: () => import("@modules/error403/error403.component").then((m) => m.Error403Component),
  },
  {
    path: "404",
    loadComponent: () => import("@modules/error403/error403.component").then((m) => m.Error403Component),
  },
  {
    path: "",
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    loadComponent: () => import("app/layout/layout.component").then((m) => m.LayoutComponent),
    resolve: {
      // initialData: initialDataResolver,
    },
    children: [
      {
        path: "home",
        loadChildren: () => import("app/modules/landing/home/home.routes"),
      },
      { path: "**", redirectTo: "home" },
    ],
  },
];
