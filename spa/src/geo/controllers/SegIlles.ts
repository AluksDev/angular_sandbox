/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { APIConfigService } from '../apiconfig.service';
import * as __model from '../model';

export interface IllesParams {
  /** Codi illa */
  sIlla: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

@Injectable({ providedIn: 'root' })
export class SegIllesService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Dades d'illes
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/SegIlles/SegIlles_DadesIlla
   */
  illes(params: IllesParams): Observable<__model.ConjuntElementsIlla> {
    const pathParams = {
      sIlla: params.sIlla,
    };
    const queryParamBase = {
      maxRegs: params.maxRegs,
    };

    let queryParams = new HttpParams();
    Object.entries(queryParamBase).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          let val = '';
          value.forEach((v) => (val += v + ','));
          if (val.length > 0) {
            val = val.slice(0, val.length - 1);
          }
          queryParams = queryParams.set(key, val);
        } else if (typeof value === 'string') {
          queryParams = queryParams.set(key, value);
        } else {
          queryParams = queryParams.set(key, JSON.stringify(value));
        }
      }
    });

    return this.http.get<__model.ConjuntElementsIlla>(
      this.apiConfigService.options.apiUrl + `/api/Illes/${pathParams.sIlla}`,
      { params: queryParams },
    );
  }
}
