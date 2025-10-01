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

export interface CantonadaParams {
  /** Nom de la variant1 */
  variant1: string;
  /** Nom de la variant2 */
  variant2: string;
  /**
   * Nombre máxim de registres de retorn admesos
   * format: int32
   */
  maxRegs?: number;
}

export interface TCantonadaParams {
  /** &gt;Nom de la variant1 */
  variant1: string;
  /** Nom de la variant2 */
  variant2: string;
  /**
   * Numero máxim de registres de retorn admesos
   * format: int32
   */
  maxRegs?: number;
}

export interface CantonadaExtParams {
  /** Tipus de via 1 */
  tipusVia1: string;
  /** Nom de la variant 1 */
  variant1: string;
  /** Tipus de via 2 */
  tipusVia2: string;
  /** Nom de la variant 2 */
  variant2: string;
  /** Cerca exacta */
  pexacta: boolean;
  /**
   * Numero máxim de registres de retorn admesos
   * format: int32
   */
  maxRegs?: number;
}

export interface DistrictesCantonadaParams {
  /** Nom de la variant 1 */
  variant1: string;
  /** Nom de la variant 2 */
  variant2: string;
}

export interface CarrersQueCreuenParams {
  /** Codi de cantonada */
  codi: string;
}

export interface CarrersQueCreuenPagParams {
  /** Codi de carrer */
  codi: string;
  /**
   * Paginacio inici
   * format: int32
   */
  nNumRegIni: number;
  /**
   * Paginacio fin
   * format: int32
   */
  nNumRegFin: number;
}

@Injectable({ providedIn: 'root' })
export class CantonadesService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Dades dels creuaments de dos carrers. (Poden creuar-se més d'1 vegada. Per exemple Places)
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Cantonades/Cantonades_Cantonada
   */
  cantonada(params: CantonadaParams): Observable<__model.ConjuntElementsCantonada> {
    const queryParamBase = {
      variant1: params.variant1,
      variant2: params.variant2,
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

    return this.http.get<__model.ConjuntElementsCantonada>(
      this.apiConfigService.options.apiUrl + '/api/Cantonades/Cantonada',
      { params: queryParams },
    );
  }

  /**
   * Geocodificar cantonada (Cantons)
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Cantonades/Cantonades_TCantonada
   */
  tCantonada(params: TCantonadaParams): Observable<__model.ConjuntElementsTCantonada> {
    const queryParamBase = {
      variant1: params.variant1,
      variant2: params.variant2,
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

    return this.http.get<__model.ConjuntElementsTCantonada>(
      this.apiConfigService.options.apiUrl + '/api/Cantonades/TCantonada',
      { params: queryParams },
    );
  }

  /**
   * Geocodificar cantonada (ext.)
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Cantonades/Cantonades_CantonadaExt
   */
  cantonadaExt(params: CantonadaExtParams): Observable<__model.ConjuntElementsCantonada> {
    const queryParamBase = {
      tipusVia1: params.tipusVia1,
      variant1: params.variant1,
      tipusVia2: params.tipusVia2,
      variant2: params.variant2,
      pexacta: params.pexacta,
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

    return this.http.get<__model.ConjuntElementsCantonada>(
      this.apiConfigService.options.apiUrl + '/api/Cantonades/CantonadaExt',
      { params: queryParams },
    );
  }

  /**
   * Districtes d'una cantonada
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Cantonades/Cantonades_DistrictesCantonada
   */
  districtesCantonada(params: DistrictesCantonadaParams): Observable<__model.ConjuntElementsDistrictesCantonada> {
    const queryParamBase = {
      variant1: params.variant1,
      variant2: params.variant2,
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

    return this.http.get<__model.ConjuntElementsDistrictesCantonada>(
      this.apiConfigService.options.apiUrl + '/api/Cantonades/DistrictesCantonada',
      { params: queryParams },
    );
  }

  /**
   * Carrers que creuen
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Cantonades/Cantonades_CarrersQueCreuen
   */
  carrersQueCreuen(params: CarrersQueCreuenParams): Observable<__model.ConjuntElementsCarrerCreuen> {
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

    return this.http.get<__model.ConjuntElementsCarrerCreuen>(
      this.apiConfigService.options.apiUrl + '/api/Cantonades/CarrersQueCreuen',
      { params: queryParams },
    );
  }

  /**
   * Carrers que creuen (pag.)
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Cantonades/Cantonades_CarrersQueCreuenPag
   */
  carrersQueCreuenPag(params: CarrersQueCreuenPagParams): Observable<__model.ConjuntElementsCarrerCreuen> {
    const queryParamBase = {
      codi: params.codi,
      nNumRegIni: params.nNumRegIni,
      nNumRegFin: params.nNumRegFin,
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

    return this.http.get<__model.ConjuntElementsCarrerCreuen>(
      this.apiConfigService.options.apiUrl + '/api/Cantonades/CarrersQueCreuenPag',
      { params: queryParams },
    );
  }
}
