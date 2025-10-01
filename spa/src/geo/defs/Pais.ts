/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Pais {
  CODI?: string;
  NOM_CATALA?: string;
  NOM_CASTELLA?: string;
  /** format: int32 */
  EntityState?: EntityStatePaisEnum;
  /** format: double */
  Id?: number;
}

export type EntityStatePaisEnum = '2' | '4' | '8' | '16';
