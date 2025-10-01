/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Parcella {
  CODI_ILLA?: string;
  CODI_PARC?: string;
  PRECODPARC?: string;
  SOLAR?: string;
  /** format: double */
  XCENT_PARC?: number;
  /** format: double */
  YCENT_PARC?: number;
  /** format: int32 */
  EntityState?: EntityStateParcellaEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateParcellaEnum = '2' | '4' | '8' | '16';
