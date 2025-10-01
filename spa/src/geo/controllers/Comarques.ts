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

export interface ComarquesParams {
  /** Codi de comarca */
  codi: string;
  /** Codi de província */
  provincia?: string;
}

export interface VariantParams {
  /** Variant de la comarca */
  variant: string;
  /** (S|N)Només coincidència exacta */
  exacta?: string;
  /**
   * Nombre de registres demanats ( 0 --&gt; sense limit )
   * format: int32
   */
  maxRegs?: number;
}

export interface ComarquesByProvinciaParams {
  /** Codi de província */
  provincia: string;
  /** (S|N)Només coincidència exacta */
  exacta?: string;
  /**
   * Nombre de registres demanats ( 0 --&gt; sense limit )
   * format: int32
   */
  maxRegs?: number;
}

export interface ComarquesByProvinciaAndVariantParams {
  /** Codi de província */
  provincia: string;
  /** Variant de la comarca */
  variant: string;
  /** (S|N)Només coincidència exacta */
  exacta?: string;
  /**
   * Nombre de registres demanats ( 0 --&gt; sense limit )
   * format: int32
   */
  maxRegs?: number;
}

@Injectable({ providedIn: 'root' })
export class ComarquesService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Valida els codis de comarca i província indicats
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Comarques/Comarques_Comarques
   */
  comarques(params: ComarquesParams): Observable<__model.ConjuntElementsComarca> {
    const pathParams = {
      codi: params.codi,
    };
    const queryParamBase = {
      provincia: params.provincia,
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

    return this.http.get<__model.ConjuntElementsComarca>(
      this.apiConfigService.options.apiUrl + `/api/Comarques/${pathParams.codi}`,
      { params: queryParams },
    );
  }

  /**
   * Obté les comarques amb nom(variant) similar o igual al indicat al paràmetre "variant"
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Comarques/Comarques_ComarquesByVariant
   */
  variant(params: VariantParams): Observable<__model.ConjuntElementsComarca> {
    const pathParams = {
      variant: params.variant,
    };
    const queryParamBase = {
      exacta: params.exacta,
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

    return this.http.get<__model.ConjuntElementsComarca>(
      this.apiConfigService.options.apiUrl + `/api/Comarques/Variant/${pathParams.variant}`,
      { params: queryParams },
    );
  }

  /**
   * Obté les comarques amb nom(variant) similar o igual al indicat al paràmetre "variant"
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Comarques/Comarques_ComarquesByProvincia
   */
  comarquesByProvincia(params: ComarquesByProvinciaParams): Observable<__model.ConjuntElementsComarca> {
    const pathParams = {
      provincia: params.provincia,
    };
    const queryParamBase = {
      exacta: params.exacta,
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

    return this.http.get<__model.ConjuntElementsComarca>(
      this.apiConfigService.options.apiUrl + `/api/Comarques/Provincia/${pathParams.provincia}`,
      { params: queryParams },
    );
  }

  /**
   * Obté les comarques amb nom(variant) similar o igual al indicat al paràmetre "variant"
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/Comarques/Comarques_ComarquesByProvinciaAndVariant
   */
  comarquesByProvinciaAndVariant(
    params: ComarquesByProvinciaAndVariantParams,
  ): Observable<__model.ConjuntElementsComarca> {
    const pathParams = {
      provincia: params.provincia,
      variant: params.variant,
    };
    const queryParamBase = {
      exacta: params.exacta,
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

    return this.http.get<__model.ConjuntElementsComarca>(
      this.apiConfigService.options.apiUrl + `/api/Comarques/Provincia/${pathParams.provincia}/${pathParams.variant}`,
      { params: queryParams },
    );
  }
}
