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

export interface ProvinciesGetParams {
  /** Identificador de provincia */
  id: string;
}

export interface ByVariantParams {
  /** Nom(variant) de la provincia */
  variant: string;
  /**
   * Nombre de registres demanats ( 0 --&gt; sense límit )
   * format: int32
   */
  maxRegs?: number;
}

export interface ByNomParams {
  /** Nom(variant) de la provincia */
  nom: string;
  /**
   * Nombre de registres demanats ( 0 --&gt; sense límit )
   * format: int32
   */
  maxRegs?: number;
}

@Injectable({ providedIn: 'root' })
export class ProvinciesService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Retorna la llista de provincies
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Provincies/Provincies_Provincies
   */
  provincies(): Observable<__model.ConjuntElementsProvincia> {
    return this.http.get<__model.ConjuntElementsProvincia>(
      this.apiConfigService.options.apiUrl + '/territori/provincies',
    );
  }

  /**
   * Retorna les dades d'una provincia
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Provincies/Provincies_Provincies_Get
   */
  provinciesGet(params: ProvinciesGetParams): Observable<__model.ConjuntElementsProvincia> {
    const pathParams = {
      id: params.id,
    };
    return this.http.get<__model.ConjuntElementsProvincia>(
      this.apiConfigService.options.apiUrl + `/api/Provincies/${pathParams.id}`,
    );
  }

  /**
   * Cerca provincies similars al nom indicat sense utilitzar variants de provincies, limitant el nombre de registres
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Provincies/Provincies_ProvinciesByVariant
   */
  byVariant(params: ByVariantParams): Observable<__model.ConjuntElementsProvincia> {
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

    return this.http.get<__model.ConjuntElementsProvincia>(
      this.apiConfigService.options.apiUrl + `/api/Provincies/ByVariant/${pathParams.variant}`,
      { params: queryParams },
    );
  }

  /**
   * Cerca provincies similars al nom indicat utilitzant la llista de variants de provincies, limitant el nombre de registres
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Provincies/Provincies_ProvinciesByNom
   */
  byNom(params: ByNomParams): Observable<__model.ConjuntElementsProvincia> {
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

    return this.http.get<__model.ConjuntElementsProvincia>(
      this.apiConfigService.options.apiUrl + `/api/Provincies/ByNom/${pathParams.nom}`,
      { params: queryParams },
    );
  }
}
