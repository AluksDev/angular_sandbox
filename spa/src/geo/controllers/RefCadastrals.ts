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

export interface RefCadPerParcelaParams {
  /** Codi de illa */
  illa: string;
  /** Codi parcel.la */
  parcela: string;
  sIlla: string;
  sParcela: string;
}

export interface RefCadPerSolarParams {
  /** Codi de solar */
  solar: string;
  sSolar: string;
}

@Injectable({ providedIn: 'root' })
export class RefCadastralsService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Ref. cadastral per illa/parcela ( Obsolet )
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/RefCadastrals/RefCadastrals_RefCadPerParcela
   */
  refCadPerParcela(params: RefCadPerParcelaParams): Observable<string> {
    const queryParamBase = {
      illa: params.illa,
      parcela: params.parcela,
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

    const pathParams = {
      sIlla: params.sIlla,
      sParcela: params.sParcela,
    };
    return this.http.get(
      this.apiConfigService.options.apiUrl + `/api/RefCadastrals/${pathParams.sIlla}/${pathParams.sParcela}`,
      { params: queryParams, responseType: 'text' },
    );
  }

  /**
   * Ref. cadastral per solar ( Obsolet )
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/RefCadastrals/RefCadastrals_RefCadPerSolar
   */
  refCadPerSolar(params: RefCadPerSolarParams): Observable<string> {
    const queryParamBase = {
      solar: params.solar,
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

    const pathParams = {
      sSolar: params.sSolar,
    };
    return this.http.get(this.apiConfigService.options.apiUrl + `/api/RefCadastrals/${pathParams.sSolar}`, {
      params: queryParams,
      responseType: 'text',
    });
  }
}
