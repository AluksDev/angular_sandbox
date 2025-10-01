/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { APIConfigService } from '../apiconfig.service';
import * as __model from '../model';

export interface BarrisGetParams {
  /** Codi de barri */
  codi: string;
}

export interface DistricteParams {
  /** Códi de districte */
  districte: string;
}

@Injectable({ providedIn: 'root' })
export class BarrisService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Obté la llista de barris de la ciutat
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Barris/Barris_Barris
   */
  barris(): Observable<__model.ConjuntElementsBarri> {
    return this.http.get<__model.ConjuntElementsBarri>(this.apiConfigService.options.apiUrl + '/api/Barris');
  }

  /**
   * Obté les dades d'un barri
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Barris/Barris_Barris_Get
   */
  barrisGet(params: BarrisGetParams): Observable<__model.ConjuntElementsBarri> {
    const pathParams = {
      codi: params.codi,
    };
    return this.http.get<__model.ConjuntElementsBarri>(
      this.apiConfigService.options.apiUrl + `/api/Barris/${pathParams.codi}`,
    );
  }

  /**
   * Obté la llista de barris d'un districte de la ciutat
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Barris/Barris_BarrisDto
   */
  districte(params: DistricteParams): Observable<__model.ConjuntElementsBarri> {
    const pathParams = {
      districte: params.districte,
    };
    return this.http.get<__model.ConjuntElementsBarri>(
      this.apiConfigService.options.apiUrl + `/api/Barris/Districte/${pathParams.districte}`,
    );
  }
}
