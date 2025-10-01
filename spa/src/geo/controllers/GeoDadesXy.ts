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

export interface GetDadesXyParams {
  /** Tipus de'area */
  tipus: string;
  /**
   * Coordenada X
   * format: int64
   */
  coordenadaX: number;
  /**
   * Coordenada Y
   * format: int64
   */
  coordenadaY: number;
}

@Injectable({ providedIn: 'root' })
export class GeoDadesXyService {
  private http = inject(HttpClient);
  private apiConfigService = inject(APIConfigService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   *  Geocodificació inversa, donades unes coordenades, obté l'àrea/polígon on es troben.
   *  PAISA		-&gt; Polígons zones especials subvencions Paisatge Urbà
   *  CARRXVB		-&gt; Xarxa Viària Bàsica
   *  SPO			-&gt; Sectors policials operatius - SPO
   *  AREAVERD	-&gt; Zones verdes d'aparcaments
   *  GUIA		-&gt; GUIA: Malla del la Guia en llibre
   *  DEMARC		-&gt; Demarcacions de la GUB (abans 2009)
   *  DTOS		-&gt; Districtes (abans 2009)
   *  SCAB		-&gt; Secciones Estadístiques - SCAB
   *  SCIN		-&gt; Seccions censals INE - SCIN (abans 2009)
   *  ZRP			-&gt; Zones de recerca petites o d'estudi - ZRP (abans 2009)
   *  ZEG			-&gt; Zones Estadístiques Grans - ZEG (abans 2009)
   *  ILLES		-&gt; Illes
   *  PARC		-&gt; Parcel·les
   *  VIAL		-&gt; Poligons de vialitat
   *  ZPARCA		-&gt; Zones verdes aparcaments (obsolet)
   *  ZINFLU		-&gt; Zones influència Àrea verda (obsolet)
   *  MINIMPOL	-&gt; Poligons mínims de vialitat
   *  ABS			-&gt; ABS - Àrees Bàsiques de Salut
   *  BARRIS		-&gt; Barris
   *  PUSOS01		-&gt; Pla d'usos districte 1
   *  DTESPOST	-&gt; Districtes Postals
   *  LIMBOMB		-&gt; Límits dels Parcs de Bombers
   *  DISTRICT	-&gt; Districtes Municipals
   *  AEB			-&gt; AEB - Àrees Estadístiques Bàsiques
   *  SEC_CENS	-&gt; Seccions Censals
   *  FULLGUIA	-&gt; GUIA: Fulls de la Guia Urbana en llibre
   *  DFULLGUI	-&gt; GUIA: Fulls dobles de la Guia Urbana en llibre
   *  CARRCENT	-&gt; Carrers Centralitzats
   * http://netiproa.corppro.imi.bcn:447/swagger/swagger-ui.html#!/GeoDadesXy/GeoDadesXy_GetDadesXy
   */
  getDadesXy(params: GetDadesXyParams): Observable<__model.ConjuntElementsPoligons> {
    const queryParamBase = {
      tipus: params.tipus,
      coordenadaX: params.coordenadaX,
      coordenadaY: params.coordenadaY,
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

    return this.http.get<__model.ConjuntElementsPoligons>(
      this.apiConfigService.options.apiUrl + '/api/GeoDadesXy/GetDadesXy',
      { params: queryParams },
    );
  }
}
