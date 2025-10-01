/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Illa {
  DISTRICTE?: string;
  CODI_ILLA?: string;
  GEOCODI?: string;
  /** format: double */
  XCENT_ILLA?: number;
  /** format: double */
  YCENT_ILLA?: number;
  /** format: double */
  XGEO_ILLA?: number;
  /** format: double */
  YGEO_ILLA?: number;
  /** format: int32 */
  EntityState?: EntityStateIllaEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateIllaEnum = '2' | '4' | '8' | '16';
