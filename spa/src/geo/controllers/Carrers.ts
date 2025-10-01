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

export interface CarrersParams {
  variante?: string;
}

export interface CarrersByCodiParams {
  /** Codi de carrer */
  codi: string;
}

export interface IneParams {
  /** Codi INE de carrer */
  codi: string;
}

export interface IndexCarrersParams {
  /** Variant del nom carrer */
  variant: string;
}

export interface IndexCarrersPagParams {
  /** Variant del nom carrer */
  variant: string;
  /**
   * Inici de la paginació ( numRegIni &gt;= 1 )
   * format: int32
   */
  numRegIni: number;
  /**
   * Final de la paginació ( numRegFin &gt;= 1 ) and ( numRegFin &gt;= numRegIni )
   * format: int32
   */
  numRegFin: number;
}

export interface VariantsUkParams {
  /** Nom de la variant(nom) de carrer. Admet comodí SQL Oracle % */
  variant: string;
  /** Tipus de variants a cercar. Valors separats per comes( A,B,C, ... ). NO admet comodí SQL Oracle % */
  llistaTipusVariant?: string;
  /**
   * Conjunt de carrers
   * format: int32
   */
  maxRegs?: number;
}

export interface NomOficialCarrerParams {
  /** Codi de carrer */
  codi: string;
  /** Tipus de via */
  tipusVia: string;
  nomComplet: string;
}

@Injectable({ providedIn: 'root' })
export class CarrersService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Retorna TOTS els carrers
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Carrers/Carrers_Carrers
   */
  carrers(params: CarrersParams): Observable<__model.ConjuntElementsCarrer> {
    const queryParamBase = {
      variante: params.variante,
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

    return this.http.get<__model.ConjuntElementsCarrer>(this.apiConfigService.options.apiUrl + '/api/Carrers', {
      params: queryParams,
    });
  }

  /**
   * Cerca  variants per codi de carrer
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Carrers/Carrers_CarrersByCodi
   */
  carrersByCodi(params: CarrersByCodiParams): Observable<__model.ConjuntElementsCarrer> {
    const pathParams = {
      codi: params.codi,
    };
    return this.http.get<__model.ConjuntElementsCarrer>(
      this.apiConfigService.options.apiUrl + `/api/Carrers/${pathParams.codi}`,
    );
  }

  /**
   * Cerca variants per codi INE de carrer
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Carrers/Carrers_CarrersByCodiIne
   */
  ine(params: IneParams): Observable<__model.ConjuntElementsCarrer> {
    const pathParams = {
      codi: params.codi,
    };
    return this.http.get<__model.ConjuntElementsCarrer>(
      this.apiConfigService.options.apiUrl + `/api/Carrers/Ine/${pathParams.codi}`,
    );
  }

  /**
   * Obté el conjunt de carrers on el nom(variant) comença pel paràmetre "variant"
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Carrers/Carrers_IndexCarrers
   */
  indexCarrers(params: IndexCarrersParams): Observable<__model.ConjuntElementsCarrer> {
    const queryParamBase = {
      variant: params.variant,
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

    return this.http.get<__model.ConjuntElementsCarrer>(
      this.apiConfigService.options.apiUrl + '/api/Carrers/IndexCarrers',
      { params: queryParams },
    );
  }

  /**
   * Obté el conjunt de carrers on el nom comença pel paràmetre "variant"
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Carrers/Carrers_IndexCarrersPag
   */
  indexCarrersPag(params: IndexCarrersPagParams): Observable<__model.ConjuntElementsCarrer> {
    const queryParamBase = {
      variant: params.variant,
      numRegIni: params.numRegIni,
      numRegFin: params.numRegFin,
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

    return this.http.get<__model.ConjuntElementsCarrer>(
      this.apiConfigService.options.apiUrl + '/api/Carrers/IndexCarrersPag',
      { params: queryParams },
    );
  }

  /**
   * Obté el conjunt de carrers amd un dels tipus de variant indicats y que la variant(nom) contingui el paràmetre 'variant' indicat
   * Si el parèmetre "variant" no conté el comodí SQL Oracle, fa una cerca exacta.
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Carrers/Carrers_VariantsUk
   */
  variantsUk(params: VariantsUkParams): Observable<__model.ConjuntElementsCarrer> {
    const queryParamBase = {
      variant: params.variant,
      llistaTipusVariant: params.llistaTipusVariant,
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

    return this.http.get<__model.ConjuntElementsCarrer>(
      this.apiConfigService.options.apiUrl + '/api/Carrers/VariantsUk',
      { params: queryParams },
    );
  }

  /**
   * Cerca el nom oficial pel codi de carrer
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Carrers/Carrers_NomOficialCarrer
   */
  nomOficialCarrer(params: NomOficialCarrerParams): Observable<__model.ConjuntElementsCarrer> {
    const queryParamBase = {
      codi: params.codi,
      tipusVia: params.tipusVia,
      nomComplet: params.nomComplet,
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

    return this.http.get<__model.ConjuntElementsCarrer>(
      this.apiConfigService.options.apiUrl + '/api/Carrers/NomOficialCarrer',
      { params: queryParams },
    );
  }
}
