import { Route } from "@angular/router";
import { DashboardPageComponent } from "@modules/landing/dashboard-page/dashboard-page.component";
import { NotAuthenticatedGuard } from "./core/auth/guards/noAuth.guard";
import { ProfileComponent } from "@modules/landing/profile.component/profile.component";
import { DepartmentListComponent } from "@modules/departments/department-list.component/department-list.component";
// import { AuthGuard } from "app/core/auth/guards/auth.guard";

// @formatter:off

export const appRoutes: Route[] = [
  // Redirect empty path to '/example'

  {
    path: "auth",
    loadChildren: () => import('./modules/auth/auth.routes')
  },



  { path: "", pathMatch: "full", redirectTo: "dashboard" },
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
    canActivate: [NotAuthenticatedGuard],
    canActivateChild: [NotAuthenticatedGuard],
    loadComponent: () => import("app/layout/layout.component").then((m) => m.LayoutComponent),
    children: [
      {
        path: "dashboard",
        loadComponent: () => DashboardPageComponent
      },
      {
        path: "profile",
        loadComponent: () => ProfileComponent
      },
      { path: "**", redirectTo: "home" },

      {
        path: "departments",
        loadChildren: () => import("@modules/departments/department.routes")
      },

      {
          path:'register',
          canActivate: [NotAuthenticatedGuard],
          loadChildren: () => import('./modules/auth/register/register.routes')
      },

      { path: "**", redirectTo: "dashboard" },
    ],
  },
];
