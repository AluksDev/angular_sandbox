/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class APIConfigServiceOptions {
  public apiUrl = environment.geoUrl;
}
@Injectable({
  providedIn: 'root',
})
export class APIConfigService {
  public options: APIConfigServiceOptions;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {
    const options = inject(APIConfigServiceOptions);

    this.options = options;
  }
}
