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

export interface ParcellesParams {
  /** Codi de illa */
  illa: string;
  /** Codi de parcel-la */
  parcella: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

@Injectable({ providedIn: 'root' })
export class SegIllaParcellaService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Dades parcel-la
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/SegIllaParcella/SegIllaParcella_DadesParcella
   */
  parcelles(params: ParcellesParams): Observable<__model.ConjuntElementsParcella> {
    const pathParams = {
      illa: params.illa,
      parcella: params.parcella,
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

    return this.http.get<__model.ConjuntElementsParcella>(
      this.apiConfigService.options.apiUrl + `/api/Parcelles/${pathParams.illa}/${pathParams.parcella}`,
      { params: queryParams },
    );
  }
}
