/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

import * as __model from '../model';

export interface Comarca {
  CODI?: string;
  NOM_CATALA?: string;
  NOM_CASTELLA?: string;
  CODI_PROV?: string;
  Provincia?: __model.Provincia;
  /** format: int32 */
  EntityState?: EntityStateComarcaEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateComarcaEnum = '2' | '4' | '8' | '16';
