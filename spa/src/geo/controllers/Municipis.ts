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

export interface MunicipisParams {
  /** Provincia */
  provincia: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

export interface QuinCodiMunicipiParams {
  /** Codi del municipi */
  codi: string;
}

export interface CheckCodiMunicipiParams {
  /** Codi de provincia */
  provincia: string;
  /** Codi de comarca */
  comarca: string;
  /** Codi de municipi */
  codi: string;
}

export interface VariantsMunicipisProvParams {
  provincia: string;
  codi: string;
  /** format: int32 */
  maxRegs?: number;
}

@Injectable({ providedIn: 'root' })
export class MunicipisService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Obté el municipi pel codi indicat
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Municipis/Municipis_Municipis
   */
  municipis(params: MunicipisParams): Observable<__model.ConjuntElementsMunicipi> {
    const queryParamBase = {
      maxRegs: params.maxRegs,
      codi_prov: params.provincia,
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

    return this.http.get<__model.ConjuntElementsMunicipi>(
      this.apiConfigService.options.apiUrl + '/territori/municipis',
      { params: queryParams },
    );
  }

  /**
   * Noms d'un municipi
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Municipis/Municipis_QuinCodiMunicipi
   */
  quinCodiMunicipi(params: QuinCodiMunicipiParams): Observable<__model.ConjuntElementsMunicipi> {
    const queryParamBase = {
      codi: params.codi,
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

    return this.http.get<__model.ConjuntElementsMunicipi>(
      this.apiConfigService.options.apiUrl + '/api/Municipis/QuinCodiMunicipi',
      { params: queryParams },
    );
  }

  /**
   * Validar el codi d'un municipi
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Municipis/Municipis_CheckCodiMunicipi
   */
  checkCodiMunicipi(params: CheckCodiMunicipiParams): Observable<boolean> {
    const queryParamBase = {
      provincia: params.provincia,
      comarca: params.comarca,
      codi: params.codi,
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

    return this.http.get<boolean>(this.apiConfigService.options.apiUrl + '/api/Municipis/CheckCodiMunicipi', {
      params: queryParams,
    });
  }

  /** http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Municipis/Municipis_VariantsMunicipisProv */
  variantsMunicipisProv(params: VariantsMunicipisProvParams): Observable<__model.ConjuntElementsVarMunicipi> {
    const queryParamBase = {
      provincia: params.provincia,
      codi: params.codi,
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

    return this.http.get<__model.ConjuntElementsVarMunicipi>(
      this.apiConfigService.options.apiUrl + '/api/Municipis/VariantsMunicipisProv',
      { params: queryParams },
    );
  }
}
