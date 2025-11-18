import { Route } from "@angular/router";
import { DashboardPageComponent } from "@modules/landing/dashboard-page/dashboard-page.component";
import { NotAuthenticatedGuard } from "./core/auth/guards/noAuth.guard";
import { ListUsersComponent } from "@modules/users/list-users/list-users.component";
import { AdminGuard } from "./core/auth/guards/admin.guard";
import { ProfileComponent } from "@modules/users/profile.component/profile.component";
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
        loadComponent: () => DashboardPageComponent,
        data: { breadcrumb: 'Dashboard' }
      },
      {
        path: "profile",
        loadComponent: () => ProfileComponent,
        data: { breadcrumb: 'Profile' }
      },

      {
        path: "departments",
        loadChildren: () => import("@modules/departments/department.routes")
      },

      {
        path: "users",
        loadChildren: () => import("@modules/users/users.routes")
      },
      
      // {
      //   path: "list-users",
      //   canActivate: [AdminGuard],
      //   loadComponent: () => ListUsersComponent
      // },

      {
          path:'register',
          canActivate: [NotAuthenticatedGuard],
          loadChildren: () => import('./modules/auth/register/register.routes'),
          data: { breadcrumb: 'Register' }
      },

      { path: "**", redirectTo: "dashboard" },
      { path: "**", redirectTo: "home" },
    ],
  },
];
