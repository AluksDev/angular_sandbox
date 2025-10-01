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

export interface PaisosGetParams {
  /** Identificador del país */
  id: string;
}

export interface ByVariantParams {
  /** Nom(variant) del país */
  variant: string;
  /**
   * Nombre de registres demanats ( 0 --&gt; sense límit )
   * format: int32
   */
  maxRegs?: number;
}

export interface ByNomParams {
  /** Nom(variant) del país */
  nom: string;
  /**
   * Nombre de registres demanats ( 0 --&gt; sense límit )
   * format: int32
   */
  maxRegs?: number;
}

@Injectable({ providedIn: 'root' })
export class PaisosService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Retorna la llista de paisos
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Paisos/Paisos_Paisos
   */
  paisos(): Observable<__model.ConjuntElementsPais> {
    return this.http.get<__model.ConjuntElementsPais>(this.apiConfigService.options.apiUrl + '/api/Paisos');
  }

  /**
   * Retorna les dades d'un pais
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Paisos/Paisos_Paisos_Get
   */
  paisosGet(params: PaisosGetParams): Observable<__model.ConjuntElementsPais> {
    const pathParams = {
      id: params.id,
    };
    return this.http.get<__model.ConjuntElementsPais>(
      this.apiConfigService.options.apiUrl + `/api/Paisos/${pathParams.id}`,
    );
  }

  /**
   * Cerca països similars al nom indicat sense utilitzar variants de Paisos, limitant el nombre de registres
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Paisos/Paisos_PaisosByVariant
   */
  byVariant(params: ByVariantParams): Observable<__model.ConjuntElementsPais> {
    const pathParams = {
      variant: params.variant,
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

    return this.http.get<__model.ConjuntElementsPais>(
      this.apiConfigService.options.apiUrl + `/api/Paisos/ByVariant/${pathParams.variant}`,
      { params: queryParams },
    );
  }

  /**
   * Cerca països similars al nom indicat utilitzant la llista de variants de Paisos, limitant el nombre de registres
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Paisos/Paisos_PaisosByNom
   */
  byNom(params: ByNomParams): Observable<__model.ConjuntElementsPais> {
    const pathParams = {
      nom: params.nom,
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

    return this.http.get<__model.ConjuntElementsPais>(
      this.apiConfigService.options.apiUrl + `/api/Paisos/ByNom/${pathParams.nom}`,
      { params: queryParams },
    );
  }
}
