/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

import * as __model from '../model';

export interface Provincia {
  CODI?: string;
  NOM_CATALA?: string;
  NOM_CASTELLA?: string;
  Comarcas?: __model.Comarca[];
  /** format: int32 */
  EntityState?: EntityStateProvinciaEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateProvinciaEnum = '2' | '4' | '8' | '16';
