import { EnvironmentProviders, Provider } from '@angular/core';
// import { authInterceptor } from 'app/core/auth/auth.interceptor';
// import { AuthService } from 'app/core/auth/auth.service';

export const provideAuth = (): (Provider | EnvironmentProviders)[] => [
  // provideHttpClient(withInterceptors([authInterceptor])),
  // {
  //     provide: ENVIRONMENT_INITIALIZER,
  // useValue: () => inject(AuthService),
  // multi: true,
  // },
];
