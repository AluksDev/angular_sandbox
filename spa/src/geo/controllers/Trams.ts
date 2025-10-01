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

export interface TramsAdrePostParams {
  /** Códi de carrer */
  codi: string;
  /** Num inici */
  numIni: string;
  /** Lletra inici */
  lletraIni: string;
  /** Num fin */
  numFin: string;
  /** Lletra fin */
  lletraFin: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs: number;
}

export interface TramsEncreuamentParams {
  /** Códi de carrer A */
  variant1: string;
  /** Códi de carrer B */
  variant2: string;
  /**
   * Coordenades nul.les (S/N)
   * format: int32
   */
  opcio: number;
}

export interface LListaTramsPerVariantsParams {
  /** Carrer */
  variantA: string;
  /** Inicia a */
  variantB: string;
  /** Fins */
  variantC: string;
}

export interface LListaTramsPerVariantAdrecaParams {
  variantA: string;
  numIni: string;
  lletraIni: string;
  numFin: string;
  lletraFin: string;
  variantC: string;
  /**
   * Coordenades nul.les (S/N)
   * format: int32
   */
  opcio: number;
}

export interface LListaTramsPerAdrecesParams {
  variantA: string;
  numIniB: string;
  lletraIniB: string;
  numFinB: string;
  lletraFinB: string;
  numIniC: string;
  lletraIniC: string;
  numFinC: string;
  lletraFinC: string;
  /**
   * Coordenades nul.les (S/N)
   * format: int32
   */
  opcio: number;
}

export interface CarrersLimitenTramParams {
  /** Códi de carrer */
  codi: string;
  /** Número inicial */
  numIni: string;
  /** Lletra inicial */
  lletraIni?: string;
  /** Número fin */
  numFin?: string;
  /** Lletra fin */
  lletraFin?: string;
}

@Injectable({ providedIn: 'root' })
export class TramsService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Llistat de tots els trams
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Trams/Trams_LlistaTotsTrams
   */
  trams(): Observable<__model.ConjuntElementsTram> {
    return this.http.get<__model.ConjuntElementsTram>(this.apiConfigService.options.apiUrl + '/api/Trams');
  }

  /**
   * Trams d'una adreça postal
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Trams/Trams_TramsAdrePost
   */
  tramsAdrePost(params: TramsAdrePostParams): Observable<__model.ConjuntElementsTram> {
    const queryParamBase = {
      codi: params.codi,
      numIni: params.numIni,
      lletraIni: params.lletraIni,
      numFin: params.numFin,
      lletraFin: params.lletraFin,
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

    return this.http.get<__model.ConjuntElementsTram>(
      this.apiConfigService.options.apiUrl + '/api/Trams/TramsAdrePost',
      { params: queryParams },
    );
  }

  /**
   * Trams d'una cruilla
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Trams/Trams_TramsEncreuament
   */
  tramsEncreuament(params: TramsEncreuamentParams): Observable<__model.ConjuntElementsTram> {
    const queryParamBase = {
      variant1: params.variant1,
      variant2: params.variant2,
      opcio: params.opcio,
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

    return this.http.get<__model.ConjuntElementsTram>(
      this.apiConfigService.options.apiUrl + '/api/Trams/TramsEncreuament',
      { params: queryParams },
    );
  }

  /**
   * Llista de nusos d'un interval de carrer
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Trams/Trams_LListaTramsPerVariants
   */
  lListaTramsPerVariants(params: LListaTramsPerVariantsParams): Observable<__model.ConjuntElementsTram> {
    const queryParamBase = {
      variantA: params.variantA,
      variantB: params.variantB,
      variantC: params.variantC,
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

    return this.http.get<__model.ConjuntElementsTram>(
      this.apiConfigService.options.apiUrl + '/api/Trams/LListaTramsPerVariants',
      { params: queryParams },
    );
  }

  /**
   * Carrers que delimitan a un tram
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Trams/Trams_LListaTramsPerVariantAdreca
   */
  lListaTramsPerVariantAdreca(params: LListaTramsPerVariantAdrecaParams): Observable<__model.ConjuntElementsTram> {
    const queryParamBase = {
      variantA: params.variantA,
      numIni: params.numIni,
      lletraIni: params.lletraIni,
      numFin: params.numFin,
      lletraFin: params.lletraFin,
      variantC: params.variantC,
      opcio: params.opcio,
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

    return this.http.get<__model.ConjuntElementsTram>(
      this.apiConfigService.options.apiUrl + '/api/Trams/LListaTramsPerVariantAdreca',
      { params: queryParams },
    );
  }

  /**
   * Llista d'adreces d'un interval de carrer
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Trams/Trams_LListaTramsPerAdreces
   */
  lListaTramsPerAdreces(params: LListaTramsPerAdrecesParams): Observable<__model.ConjuntElementsTram> {
    const queryParamBase = {
      variantA: params.variantA,
      numIniB: params.numIniB,
      lletraIniB: params.lletraIniB,
      numFinB: params.numFinB,
      lletraFinB: params.lletraFinB,
      numIniC: params.numIniC,
      lletraIniC: params.lletraIniC,
      numFinC: params.numFinC,
      lletraFinC: params.lletraFinC,
      opcio: params.opcio,
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

    return this.http.get<__model.ConjuntElementsTram>(
      this.apiConfigService.options.apiUrl + '/api/Trams/LListaTramsPerAdreces',
      { params: queryParams },
    );
  }

  /**
   * Carrers que delimiten a un tram
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Trams/Trams_CarrersLimitenTram
   */
  carrersLimitenTram(params: CarrersLimitenTramParams): Observable<__model.ConjuntElementsDelimitacioTram> {
    const queryParamBase = {
      codi: params.codi,
      numIni: params.numIni,
      lletraIni: params.lletraIni,
      numFin: params.numFin,
      lletraFin: params.lletraFin,
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

    return this.http.get<__model.ConjuntElementsDelimitacioTram>(
      this.apiConfigService.options.apiUrl + '/api/Trams/CarrersLimitenTram',
      { params: queryParams },
    );
  }
}
