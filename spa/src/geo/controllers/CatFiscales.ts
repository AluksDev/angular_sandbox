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

export interface CFinParams {
  /** Data */
  data: string;
  /** Codi de carrer */
  carrer: string;
  /** Numero de carrer */
  numpost: string;
  /** Lletra inicial de l'adreça postal */
  llepost?: string;
}

export interface PostCFinParams {
  codi: string;
  carrer: string;
  data: string;
  numpost: string;
  llepost?: string;
  usuari?: string;
}

export interface CIaeParams {
  /** Data */
  data: string;
  /** Codi de carrer */
  carrer: string;
  /** Numero de carrer */
  numpost: string;
  /** Lletra inicial de l'adreça postal */
  llepost?: string;
}

export interface PostCIaeParams {
  codi: string;
  carrer: string;
  data: string;
  numpost: string;
  llepost?: string;
  usuari?: string;
}

export interface CFinHistParams {
  /** Data */
  dataini: string;
  /** Data */
  datafin: string;
  /** Codi de carrer */
  carrer: string;
  /** Numero de carrer */
  numpost: string;
  /** Lletra inicial de l'adreça postal */
  llepost?: string;
}

export interface PutCFinParams {
  codi: string;
  carrer: string;
  datainici: string;
  datafi: string;
  numpost: string;
  llepost?: string;
  usuari?: string;
}

export interface CIaeHistParams {
  /** Data */
  dataini: string;
  /** Data */
  datafin: string;
  /** Codi de carrer */
  carrer: string;
  /** Numero de carrer */
  numpost: string;
  /** Lletra inicial de l'adreça postal */
  llepost?: string;
}

export interface PutCIaeParams {
  codi: string;
  carrer: string;
  datainici: string;
  datafi: string;
  numpost: string;
  llepost?: string;
  usuari?: string;
}

export interface AdrecaIllaParams {
  /** illa */
  illainici: string;
  /** illa */
  illafi?: string;
  /** Codi de carrer */
  carrer?: string;
  /** Data */
  data?: string;
}

export interface AdrecaNumParams {
  /** Codi de carrer */
  carrer: string;
  /** Numeració postal */
  numpostini: string;
  /** Numeració postal */
  numpostfi?: string;
  /** Data */
  data?: string;
}

export interface AdrecaNumTipusNumParams {
  /** Codi de carrer */
  carrer: string;
  /** Numeració postal */
  numpostini: string;
  /** Numeració postal */
  numpostfi?: string;
  /** Data */
  data?: string;
  /** Tipus numeració */
  tipusnum?: string;
}

export interface AdrecesBuidaParams {
  /** Data */
  data?: string;
}

@Injectable({ providedIn: 'root' })
export class CatFiscalesService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Donada una adreça postal, retorna la categoria fiscal a una data indicada
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_CFin
   */
  cFin(params: CFinParams): Observable<string> {
    const queryParamBase = {
      data: params.data,
      carrer: params.carrer,
      numpost: params.numpost,
      llepost: params.llepost,
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

    return this.http.get(this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/CFin', {
      params: queryParams,
      responseType: 'text',
    });
  }

  /**
   * Modifica una categoria fiscal
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_PostCFin
   */
  postCFin(params: PostCFinParams): Observable<number> {
    const queryParamBase = {
      codi: params.codi,
      carrer: params.carrer,
      data: params.data,
      numpost: params.numpost,
      llepost: params.llepost,
      usuari: params.usuari,
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

    return this.http.post<number>(
      this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/CFin',
      {},
      { params: queryParams },
    );
  }

  /**
   * Donada una adreça postal, retorna la categoria IAE a una data indicada
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_CIae
   */
  cIae(params: CIaeParams): Observable<string> {
    const queryParamBase = {
      data: params.data,
      carrer: params.carrer,
      numpost: params.numpost,
      llepost: params.llepost,
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

    return this.http.get(this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/CIae', {
      params: queryParams,
      responseType: 'text',
    });
  }

  /**
   * Modifica una categoria d'obres
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_PostCIae
   */
  postCIae(params: PostCIaeParams): Observable<number> {
    const queryParamBase = {
      codi: params.codi,
      carrer: params.carrer,
      data: params.data,
      numpost: params.numpost,
      llepost: params.llepost,
      usuari: params.usuari,
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

    return this.http.post<number>(
      this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/CIae',
      {},
      { params: queryParams },
    );
  }

  /**
   * Funció que retorna un conjunt de registres de la taula adreces_cfin per a un període concret
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_CFinHist
   */
  cFinHist(params: CFinHistParams): Observable<__model.ConjuntElementsAdrecaCFin> {
    const queryParamBase = {
      dataini: params.dataini,
      datafin: params.datafin,
      carrer: params.carrer,
      numpost: params.numpost,
      llepost: params.llepost,
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

    return this.http.get<__model.ConjuntElementsAdrecaCFin>(
      this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/CFin/Hist',
      { params: queryParams },
    );
  }

  /**
   * Modifica una categoria fiscal d'històric
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_PutCFin
   */
  putCFin(params: PutCFinParams): Observable<number> {
    const queryParamBase = {
      codi: params.codi,
      carrer: params.carrer,
      datainici: params.datainici,
      datafi: params.datafi,
      numpost: params.numpost,
      llepost: params.llepost,
      usuari: params.usuari,
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

    return this.http.post<number>(
      this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/CFin/Hist',
      {},
      { params: queryParams },
    );
  }

  /**
   * Funció que retorna un conjunt de registres de la taula adreces_ciae per a un període concret
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_CIaeHist
   */
  cIaeHist(params: CIaeHistParams): Observable<__model.ConjuntElementsAdrecaCIae> {
    const queryParamBase = {
      dataini: params.dataini,
      datafin: params.datafin,
      carrer: params.carrer,
      numpost: params.numpost,
      llepost: params.llepost,
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

    return this.http.get<__model.ConjuntElementsAdrecaCIae>(
      this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/CIae/Hist',
      { params: queryParams },
    );
  }

  /**
   * Modifica una categoria d'obres d'històric
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_PutCIae
   */
  putCIae(params: PutCIaeParams): Observable<number> {
    const queryParamBase = {
      codi: params.codi,
      carrer: params.carrer,
      datainici: params.datainici,
      datafi: params.datafi,
      numpost: params.numpost,
      llepost: params.llepost,
      usuari: params.usuari,
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

    return this.http.post<number>(
      this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/CIae/Hist',
      {},
      { params: queryParams },
    );
  }

  /**
   * Funció que retorna un conjunt de registres de la taula adreces per una illa o rang de illas i per a un carrer concret o no i per a la data concreta retorna el cfin i ciae.
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_AdrecaIlla
   */
  adrecaIlla(params: AdrecaIllaParams): Observable<__model.ConjuntElementsAdrecaFiscal> {
    const queryParamBase = {
      illainici: params.illainici,
      illafi: params.illafi,
      carrer: params.carrer,
      data: params.data,
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

    return this.http.get<__model.ConjuntElementsAdrecaFiscal>(
      this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/AdrecaIlla',
      { params: queryParams },
    );
  }

  /**
   * Funció que retorna un conjunt de registres de la taula adreces per a un rang de nombres  per a un carrer concret i per a la data concreta retorna el cfin i ciae.
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_AdrecaNum
   */
  adrecaNum(params: AdrecaNumParams): Observable<__model.ConjuntElementsAdrecaFiscal> {
    const queryParamBase = {
      carrer: params.carrer,
      numpostini: params.numpostini,
      numpostfi: params.numpostfi,
      data: params.data,
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

    return this.http.get<__model.ConjuntElementsAdrecaFiscal>(
      this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/AdrecaNum',
      { params: queryParams },
    );
  }

  /**
   * Funció que retorna un conjunt de registres de la taula adreces per a un rang de nombres per a un carrer concret, per a la data concreta i per a un tipus de numeració concret retorna el cfin i ciae.
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_AdrecaNumTipusNum
   */
  adrecaNumTipusNum(params: AdrecaNumTipusNumParams): Observable<__model.ConjuntElementsAdrecaFiscal> {
    const queryParamBase = {
      carrer: params.carrer,
      numpostini: params.numpostini,
      numpostfi: params.numpostfi,
      data: params.data,
      tipusnum: params.tipusnum,
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

    return this.http.get<__model.ConjuntElementsAdrecaFiscal>(
      this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/AdrecaNumTipusNum',
      { params: queryParams },
    );
  }

  /**
   * Funció que retorna un conjunt de registres de la taula adreces que no tenen una categoria fiscal (cfin) per a la data concreta.
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/CatFiscales/CatFiscales_AdrecesBuida
   */
  adrecesBuida(params: AdrecesBuidaParams): Observable<__model.ConjuntElementsAdrecaFiscal> {
    const queryParamBase = {
      data: params.data,
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

    return this.http.get<__model.ConjuntElementsAdrecaFiscal>(
      this.apiConfigService.options.apiUrl + '/api/CategoriasFiscales/AdrecesBuida',
      { params: queryParams },
    );
  }
}
