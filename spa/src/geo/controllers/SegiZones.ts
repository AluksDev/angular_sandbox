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

export interface DadesZonaParams {
  codiCarrer: string;
  numIni: string;
  lletraIni?: string;
  numFin?: string;
  lletraFin?: string;
  /** format: int32 */
  maxRegs?: number;
}

export interface DadesZonesIllaParcellaParams {
  illa: string;
  parcella: string;
  /** format: int32 */
  maxRegs?: number;
}

@Injectable({ providedIn: 'root' })
export class SegiZonesService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /** http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/SegiZones/SegiZones_DadesZona */
  dadesZona(params: DadesZonaParams): Observable<__model.ConjuntElementsZones> {
    const queryParamBase = {
      codiCarrer: params.codiCarrer,
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

    return this.http.get<__model.ConjuntElementsZones>(
      this.apiConfigService.options.apiUrl + '/api/SegiZones/DadesZona',
      { params: queryParams },
    );
  }

  /** http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/SegiZones/SegiZones_DadesZonesIllaParcella */
  dadesZonesIllaParcella(params: DadesZonesIllaParcellaParams): Observable<__model.ConjuntElementsZones> {
    const queryParamBase = {
      illa: params.illa,
      parcella: params.parcella,
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

    return this.http.get<__model.ConjuntElementsZones>(
      this.apiConfigService.options.apiUrl + '/api/SegiZones/DadesZonesIllaParcella',
      { params: queryParams },
    );
  }
}
