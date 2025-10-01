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

export interface DomicilisParams {
  /** Illa */
  codIIlla: string;
  /** Parcel.la */
  codiParcella: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

export interface ValidaDomiciliParams {
  /** Códi de carrer */
  codiCarrer: string;
  /** Número inicial */
  numIni: string;
  /** Lletra inicial */
  lletraIni: string;
  /** Bis inicial */
  bisIni: string;
  /** Número final */
  numFi: string;
  /** Lletra final */
  lletraFi: string;
  /** Bis final */
  bisFi: string;
  /** Escala */
  escala: string;
  /** Pis */
  pis: string;
  /** Porta */
  porta: string;
  /** Tipus */
  tipus: string;
  /** Principal */
  principal: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

export interface ValidaDomiciliPerCodiParams {
  /** Codi */
  codigoDom: string;
  /** Tipus */
  tipo: string;
  /** Principal */
  principal: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

export interface AccessosAdrePostParams {
  /** Códi de carrer */
  codi: string;
  /** Número inicial */
  numIni: string;
  /** Lletra inicial */
  lletraIni?: string;
  /** Bis inicial */
  bisIni?: string;
  /** Número final */
  numFin?: string;
  /** Lletra final */
  lletraFin?: string;
  /** Bis final */
  bisFin?: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

@Injectable({ providedIn: 'root' })
export class DomicilisService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Domicilis d'una parcel·la
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Domicilis/Domicilis_AccessosParcella
   */
  domicilis(params: DomicilisParams): Observable<__model.ConjuntElementsDomicili> {
    const pathParams = {
      codIIlla: params.codIIlla,
      codiParcella: params.codiParcella,
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

    return this.http.get<__model.ConjuntElementsDomicili>(
      this.apiConfigService.options.apiUrl + `/api/Domicilis/${pathParams.codIIlla}/${pathParams.codiParcella}`,
      { params: queryParams },
    );
  }

  /**
   * Validació de domicilis
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Domicilis/Domicilis_ValidaDomicili
   */
  validaDomicili(params: ValidaDomiciliParams): Observable<__model.ConjuntElementsDomicili> {
    const queryParamBase = {
      codiCarrer: params.codiCarrer,
      numIni: params.numIni,
      lletraIni: params.lletraIni,
      bisIni: params.bisIni,
      numFi: params.numFi,
      lletraFi: params.lletraFi,
      bisFi: params.bisFi,
      escala: params.escala,
      pis: params.pis,
      porta: params.porta,
      tipus: params.tipus,
      principal: params.principal,
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

    return this.http.get<__model.ConjuntElementsDomicili>(
      this.apiConfigService.options.apiUrl + '/api/Domicilis/ValidaDomicili',
      { params: queryParams },
    );
  }

  /**
   * Validació de codi/identificador de domicili
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Domicilis/Domicilis_ValidaDomiciliPerCodi
   */
  validaDomiciliPerCodi(params: ValidaDomiciliPerCodiParams): Observable<__model.ConjuntElementsDomicili> {
    const queryParamBase = {
      codigoDom: params.codigoDom,
      tipo: params.tipo,
      principal: params.principal,
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

    return this.http.get<__model.ConjuntElementsDomicili>(
      this.apiConfigService.options.apiUrl + '/api/Domicilis/ValidaDomiciliPerCodi',
      { params: queryParams },
    );
  }

  /**
   * Domicilis d'una adreça postal
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Domicilis/Domicilis_AccessosAdrePost
   */
  accessosAdrePost(params: AccessosAdrePostParams): Observable<__model.ConjuntElementsDomicili> {
    const queryParamBase = {
      codi: params.codi,
      numIni: params.numIni,
      lletraIni: params.lletraIni,
      bisIni: params.bisIni,
      numFin: params.numFin,
      lletraFin: params.lletraFin,
      bisFin: params.bisFin,
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

    return this.http.get<__model.ConjuntElementsDomicili>(
      this.apiConfigService.options.apiUrl + '/api/Domicilis/AccessosAdrePost',
      { params: queryParams },
    );
  }
}
