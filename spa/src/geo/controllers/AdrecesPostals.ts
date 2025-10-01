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

export interface PosicioNumeroParams {
  /** Codi de carrer */
  codiCarrer: string;
  /** Numeració demanada: N (qualsevol), I (inicial), F (final), C (central) */
  opcio: string;
}

export interface VarDirPostParams {
  /** Nom de la variant de carrer */
  variant: string;
  /** Número inicial de la direcció postal */
  numIni: string;
  /** Lletra inicial de la direcció postal */
  lletraIni?: string;
  /** Número final de la direcció postal */
  numFin?: string;
  /** Lletra final de la direcció postal */
  lletraFin?: string;
  /** Tipus de via */
  tipusVia?: string;
  /** Tipus de numeració (1-senar 2-parell, ...) */
  tipusNum?: string;
  /** Tipus de sequencia de numeració del carrer (0-cap, 1-contínua, 2-alterna, 9-indeterm.) */
  tipusSeq?: string;
  /** Permet cerca de noms de variants similars */
  exacta?: string;
  /** Indica si les adrecis postals sense coordenades són retornades (S|N) */
  nullCoord?: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

export interface VarDirPostExtParams {
  /** Nom de la variant de carrer */
  variant: string;
  /** Número i lletra inicial i final, en format ####A####A (22A202B) */
  numero: string;
  /** Tipus de via */
  tipusVia?: string;
  /** Tipus de numeració (1-senar 2-parell, ...) */
  tipusNum?: string;
  /** Tipus de sequencia de numeració del carrer (0-cap, 1-contínua, 2-alterna, 9-indeterm.) */
  tipusSeq?: string;
  /** Permet cerca de noms de variants similars */
  exacta?: string;
  /** Indica si les adrecis postals sense coordenades són retornades (S|N) */
  nullCoord?: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

export interface DirPostParams {
  /** Tipus de via */
  codiCarrer: string;
  /** Número inicial de la direcció postal */
  numIni?: string;
  /** Lletra inicial de la direcció postal */
  lletraIni?: string;
  /** Número final de la direcció postal */
  numFin?: string;
  /** Lletra final de la direcció postal */
  lletraFin?: string;
  /** Tipus de numeració (1-senar 2-parell, ...) */
  tipusNum?: string;
  /** Tipus de sequencia de numeració del carrer (0-cap, 1-contínua, 2-alterna, 9-indeterm.) */
  tipusSeq?: string;
  /** Indica si les adrecis postals sense coordenades són retornades (S|N) */
  nullCoord?: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

export interface RangoDirPostParams {
  /** Codi del carrer */
  codi: string;
  /**
   * Coordenada x min
   * format: int64
   */
  nXMin: number;
  /**
   * Coordenada y min
   * format: int64
   */
  nYMin: number;
  /**
   * Coordenada x Max
   * format: int64
   */
  nXMax: number;
  /**
   * Coordenada Y Max
   * format: int64
   */
  nYMax: number;
  /** Tipus de numeració (1-senar 2-parell, ...) */
  tipusNum?: string;
  /** Tipus de sequencia de numeració del carrer (0-cap, 1-contínua, 2-alterna, 9-indeterm.) */
  tipusSeq?: string;
  /** Indica si les adrecis postals sense coordenades són retornades (S|N) */
  sNullCoord?: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

export interface GetDirPostXyParams {
  /**
   * Coordenada x
   * format: int64
   */
  nX: number;
  /**
   * Coordenada y
   * format: int64
   */
  nY: number;
  /**
   * Rang mínim
   * format: int64
   */
  minRang: number;
  /**
   * Rang màxim
   * format: int64
   */
  maxRang: number;
  /**
   * Interval
   * format: int64
   */
  interval: number;
}

export interface IntervalAdrePostParams {
  variant: string;
  /** Carrer inicial */
  carrerIni: string;
  /** Num inicial */
  numIni: string;
  /** Carrer final */
  carrerFin: string;
  /** Num final */
  numFin: string;
  nullCoord?: string;
  /**
   * Número màxim de registres admés
   * format: int32
   */
  maxRegs?: number;
}

@Injectable({ providedIn: 'root' })
export class AdrecesPostalsService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Obté el primer, l'últim o el número central del carrer
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/AdrecesPostals/AdrecesPostals_PosicioNumero
   */
  posicioNumero(params: PosicioNumeroParams): Observable<__model.ConjuntElementsAdrecaPostal> {
    const queryParamBase = {
      codiCarrer: params.codiCarrer,
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

    return this.http.get<__model.ConjuntElementsAdrecaPostal>(
      this.apiConfigService.options.apiUrl + '/api/AdrecesPostals/PosicioNumero',
      { params: queryParams },
    );
  }

  /**
   * Obté les adreces postals del carrer pel nom de variant, en el interval de numeració postal indicat
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/AdrecesPostals/AdrecesPostals_VarDirPost
   */
  varDirPost(params: VarDirPostParams): Observable<__model.ConjuntElementsAdrecaPostal> {
    const queryParamBase = {
      variant: params.variant,
      numIni: params.numIni,
      lletraIni: params.lletraIni,
      numFin: params.numFin,
      lletraFin: params.lletraFin,
      tipusVia: params.tipusVia,
      tipusNum: params.tipusNum,
      tipusSeq: params.tipusSeq,
      exacta: params.exacta,
      nullCoord: params.nullCoord,
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

    return this.http.get<__model.ConjuntElementsAdrecaPostal>(
      this.apiConfigService.options.apiUrl + '/api/AdrecesPostals/VarDirPost',
      { params: queryParams },
    );
  }

  /**
   * Obté les adreces postals del carrer pel nom de variant, en el interval de numeració postal indicat
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/AdrecesPostals/AdrecesPostals_VarDirPostExt
   */
  varDirPostExt(params: VarDirPostExtParams): Observable<__model.ConjuntElementsAdrecaPostal> {
    const queryParamBase = {
      variant: params.variant,
      numero: params.numero,
      tipusVia: params.tipusVia,
      tipusNum: params.tipusNum,
      tipusSeq: params.tipusSeq,
      exacta: params.exacta,
      nullCoord: params.nullCoord,
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

    return this.http.get<__model.ConjuntElementsAdrecaPostal>(
      this.apiConfigService.options.apiUrl + '/api/AdrecesPostals/VarDirPostExt',
      { params: queryParams },
    );
  }

  /**
   * Obté les adreces postals del carrer pel codi de carrer, en el interval de numeració postal indicat
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/AdrecesPostals/AdrecesPostals_DirPost
   */
  dirPost(params: DirPostParams): Observable<__model.ConjuntElementsAdrecaPostal> {
    const queryParamBase = {
      codiCarrer: params.codiCarrer,
      numIni: params.numIni,
      lletraIni: params.lletraIni,
      numFin: params.numFin,
      lletraFin: params.lletraFin,
      tipusNum: params.tipusNum,
      tipusSeq: params.tipusSeq,
      nullCoord: params.nullCoord,
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

    return this.http.get<__model.ConjuntElementsAdrecaPostal>(
      this.apiConfigService.options.apiUrl + '/api/AdrecesPostals/DirPost',
      { params: queryParams },
    );
  }

  /**
   * Obté les adreces postals del carrer indicat existents en un rang gràfic
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/AdrecesPostals/AdrecesPostals_RangoDirPost
   */
  rangoDirPost(params: RangoDirPostParams): Observable<__model.ConjuntElementsAdrecaPostal> {
    const queryParamBase = {
      codi: params.codi,
      nXMin: params.nXMin,
      nYMin: params.nYMin,
      nXMax: params.nXMax,
      nYMax: params.nYMax,
      tipusNum: params.tipusNum,
      tipusSeq: params.tipusSeq,
      sNullCoord: params.sNullCoord,
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

    return this.http.get<__model.ConjuntElementsAdrecaPostal>(
      this.apiConfigService.options.apiUrl + '/api/AdrecesPostals/RangoDirPost',
      { params: queryParams },
    );
  }

  /**
   * Funcionalitat que donades les coordenades d'un punt retorna la direcció(ns) més propera. S'estableix un radi mínim i màxim de cerca i un interval.
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/AdrecesPostals/AdrecesPostals_GetDirPostXy
   */
  getDirPostXy(params: GetDirPostXyParams): Observable<__model.ConjuntElementsAdrecaPostal> {
    const queryParamBase = {
      nX: params.nX,
      nY: params.nY,
      minRang: params.minRang,
      maxRang: params.maxRang,
      interval: params.interval,
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

    return this.http.get<__model.ConjuntElementsAdrecaPostal>(
      this.apiConfigService.options.apiUrl + '/api/AdrecesPostals/GetDirPostXy',
      { params: queryParams },
    );
  }

  /**
   * Adreçes d'un interval de trams
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/AdrecesPostals/AdrecesPostals_IntervalAdrePost
   */
  intervalAdrePost(params: IntervalAdrePostParams): Observable<__model.ConjuntElementsAdrecaPostal> {
    const queryParamBase = {
      variant: params.variant,
      carrerIni: params.carrerIni,
      numIni: params.numIni,
      carrerFin: params.carrerFin,
      numFin: params.numFin,
      nullCoord: params.nullCoord,
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

    return this.http.get<__model.ConjuntElementsAdrecaPostal>(
      this.apiConfigService.options.apiUrl + '/api/AdrecesPostals/IntervalAdrePost',
      { params: queryParams },
    );
  }
}
