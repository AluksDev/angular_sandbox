import { registerLocaleData } from "@angular/common";
import { provideHttpClient, withInterceptors, withJsonpSupport } from "@angular/common/http";
import localeCa from "@angular/common/locales/ca";
import { ApplicationConfig, LOCALE_ID, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { LuxonDateAdapter } from "@angular/material-luxon-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from "@angular/router";
import { appRoutes } from "@app/app.routes";
import { AuthService } from "@app/core/auth/auth.service";
import { provideIcons } from "@app/core/icons/icons.provider";
import { RuntimeConfigService } from "@app/runtime-config.service";
import { provideFuse } from "@fuse";
import { FuseThemeService } from "@fuse/services/theme/theme.service"; // Importa los datos de localización para catalán
// import {
//   provideClientHydration,
//   withEventReplay,
// } from '@angular/platform-browser';

import { LayoutService } from "@utils/layout.service";
import { authInterceptor } from "./core/auth/auth.interceptor";
import { getCatPaginatorIntl } from "./i18n/cat-paginator-intl";

registerLocaleData(localeCa, "ca-CA"); // Cambia 'ca-CA' a 'ca-ES' si es necesario
registerLocaleData(localeCa, "ca-ES"); // Registrar el locale catalán como 'ca-ES'

// TODO: Initialize runtime configuration values from /assets/runtime-config.json when needed
export const appConfig: ApplicationConfig = {
  providers: [
    FuseThemeService,
    LayoutService,
    RuntimeConfigService,
    {
      provide: LOCALE_ID,
      useValue: "ca-CA",
    },
    {
      provide: LOCALE_ID,
      useValue: "ca-ES",
    },
    // },
    provideIcons(),
    provideFuse({
      fuse: {
        layout: "classic",
        scheme: "light",
        screens: {
          sm: "600px",
          md: "960px",
          lg: "1280px",
          xl: "1440px",
        },
        theme: "theme-brand",
        themes: [
          {
            id: "theme-default",
            name: "Default",
          },
          {
            id: "theme-brand",
            name: "Brand",
          },
          {
            id: "theme-teal",
            name: "Teal",
          },
          {
            id: "theme-rose",
            name: "Rose",
          },
          {
            id: "theme-purple",
            name: "Purple",
          },
          {
            id: "theme-amber",
            name: "Amber",
          },
        ],
      },
    }),
    provideAnimationsAsync(),
    provideHttpClient(withJsonpSupport()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes, withPreloading(PreloadAllModules), withInMemoryScrolling({ scrollPositionRestoration: "enabled" })),
    AuthService,

    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
    },
    { provide: MatPaginatorIntl, useValue: getCatPaginatorIntl() },

    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: "D",
        },
        display: {
          dateInput: "DDD",
          monthYearLabel: "LLL yyyy",
          dateA11yLabel: "DD",
          monthYearA11yLabel: "LLLL yyyy",
        },
      },
    },

    // Transloco Config
    // TODO: Add API config when API client is available
  ],
};
