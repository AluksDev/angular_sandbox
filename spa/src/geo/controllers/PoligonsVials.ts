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

export interface VialitatTerritoriParams {
  /** Codi de polígon */
  codi: string;
  /**
   * Máxim número de registres admesos
   * format: int32
   */
  maxRegs?: number;
}

export interface PoligonsVialsParams {
  /** Tipus de via */
  tipusVia: string;
  /** Nom de la variant */
  variant: string;
  /** Número postal de carrer inicial */
  numIni: string;
  /** Lletra l'adreça de carrer inicial */
  lletraIni: string;
  /** Número postal de carrer final */
  numFin: string;
  /** Lletra l'adreça de carrer final */
  lletraFin: string;
  /** Tipus de numeración del carrer */
  tipusNum: string;
  /** Tipus de seqüència */
  tipusSeq: string;
  /** Polígon carrer */
  polCarrer: string;
  /**
   * Nombre màxim de resultats de la consulta
   * format: int32
   */
  maxRegs?: number;
}

@Injectable({ providedIn: 'root' })
export class PoligonsVialsService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Retorna un cursor amb els polígons de vialitat (polvial) que es troben dins d'un polígon donat
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/PoligonsVials/PoligonsVials_VialitatTerritori
   */
  vialitatTerritori(params: VialitatTerritoriParams): Observable<__model.ConjuntElementsPolVial> {
    const queryParamBase = {
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

    return this.http.get<__model.ConjuntElementsPolVial>(
      this.apiConfigService.options.apiUrl + '/api/PoligonsVials/VialitatTerritori',
      { params: queryParams },
    );
  }

  /**
   * Obté els polígons de vialitat d'una adreça postal
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/PoligonsVials/PoligonsVials_PoligonsVials
   */
  poligonsVials(params: PoligonsVialsParams): Observable<__model.ConjuntElementsPolVial> {
    const queryParamBase = {
      tipusVia: params.tipusVia,
      variant: params.variant,
      numIni: params.numIni,
      lletraIni: params.lletraIni,
      numFin: params.numFin,
      lletraFin: params.lletraFin,
      tipusNum: params.tipusNum,
      tipusSeq: params.tipusSeq,
      polCarrer: params.polCarrer,
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

    return this.http.get<__model.ConjuntElementsPolVial>(
      this.apiConfigService.options.apiUrl + '/api/PoligonsVials/PoligonsVials',
      { params: queryParams },
    );
  }
}
