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

export interface NumeracionsGetParams {
  /** Identificador de tipus de numeració */
  id: string;
}

@Injectable({ providedIn: 'root' })
export class NumeracionsService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Retorna la llista de tipus de numeracions
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Numeracions/Numeracions_Numeracions
   */
  numeracions(): Observable<__model.ConjuntElementsTipusNumeracio> {
    return this.http.get<__model.ConjuntElementsTipusNumeracio>(
      this.apiConfigService.options.apiUrl + '/api/Numeracions',
    );
  }

  /**
   * Retorna les dades d'un tipus de numeracions
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Numeracions/Numeracions_Numeracions_Get
   */
  numeracionsGet(params: NumeracionsGetParams): Observable<__model.ConjuntElementsTipusNumeracio> {
    const pathParams = {
      id: params.id,
    };
    return this.http.get<__model.ConjuntElementsTipusNumeracio>(
      this.apiConfigService.options.apiUrl + `/api/Numeracions/${pathParams.id}`,
    );
  }
}
