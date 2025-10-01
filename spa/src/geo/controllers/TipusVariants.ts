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

export interface TipusVariantsGetParams {
  /** Identificador del tipus de variant */
  id: string;
}

@Injectable({ providedIn: 'root' })
export class TipusVariantsService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Retorna la llista de tipus de variant
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/TipusVariants/TipusVariants_TipusVariants
   */
  tipusVariants(): Observable<__model.ConjuntElementsTipusVariant> {
    return this.http.get<__model.ConjuntElementsTipusVariant>(
      this.apiConfigService.options.apiUrl + '/api/TipusVariants',
    );
  }

  /**
   * Retorna les dades d'un tipus de variant
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/TipusVariants/TipusVariants_TipusVariants_Get
   */
  tipusVariantsGet(params: TipusVariantsGetParams): Observable<__model.ConjuntElementsTipusVariant> {
    const pathParams = {
      id: params.id,
    };
    return this.http.get<__model.ConjuntElementsTipusVariant>(
      this.apiConfigService.options.apiUrl + `/api/TipusVariants/${pathParams.id}`,
    );
  }
}
