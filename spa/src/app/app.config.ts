import { registerLocaleData } from "@angular/common";
import { provideHttpClient, withFetch, withInterceptors, withJsonpSupport } from "@angular/common/http";
import { ApplicationConfig, LOCALE_ID, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { LuxonDateAdapter } from "@angular/material-luxon-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from "@angular/router";
import { appRoutes } from "@app/app.routes";
import { AuthService } from "@app/core/services/auth.service";
import { provideIcons } from "@app/core/icons/icons.provider";
import { RuntimeConfigService } from "@app/runtime-config.service";
import { provideFuse } from "@fuse";
import { FuseThemeService } from "@fuse/services/theme/theme.service";
import localeEs from "@angular/common/locales/es";
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { authInterceptor } from "./core/interceptors/auth.interceptor";
import { getCatPaginatorIntl } from "./i18n/cat-paginator-intl";
import { errorInterceptor } from "./core/interceptors/error.interceptor";
import { loadingInterceptor } from "./core/interceptors/loading.interceptor";

registerLocaleData(localeEs, "es-ES");

// TODO: Initialize runtime configuration values from /assets/runtime-config.json when needed
export const appConfig: ApplicationConfig = {
  providers: [
    FuseThemeService,
    RuntimeConfigService,
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor, loadingInterceptor]), withJsonpSupport()),
    {
      provide: LOCALE_ID,
      useValue: "es-ES",
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-ES',
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
