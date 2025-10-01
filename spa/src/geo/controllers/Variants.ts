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

export interface VariantsParams {
  /** Nom de la variant(nom) de carrer. Admet comodí SQL Oracle % */
  variant: string;
  /** Tipus de variants a cercar. Valors separats per comes( A,B,C, ... ). NO admet comodí SQL Oracle % */
  llistaTipusVariant?: string;
  /**
   * Conjunt de variants-carrers
   * format: int32
   */
  maxRegs?: number;
}

@Injectable({ providedIn: 'root' })
export class VariantsService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Obté el conjunt de variants-carrers amd un dels tipus de variant indicats y que la variant(nom) contingui el paràmetre 'variant' indicat
   * Si el parèmetre "variant" no conté el comodí SQL Oracle, fa una cerca exacta.
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Variants/Variants_Variants
   */
  variants(params: VariantsParams): Observable<__model.ConjuntElementsVariant> {
    const queryParamBase = {
      variant: params.variant,
      llistaTipusVariant: params.llistaTipusVariant,
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

    return this.http.get<__model.ConjuntElementsVariant>(
      this.apiConfigService.options.apiUrl + '/api/Variants/Variants',
      { params: queryParams },
    );
  }
}
