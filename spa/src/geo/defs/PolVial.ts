/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface PolVial {
  CODI_CARR?: string;
  CODI_PARC?: string;
  CODI_ILLA?: string;
  CODI_SEQ?: string;
  /** format: double */
  LONG_TRAM?: number;
  /** format: double */
  LONG_FACA?: number;
  /** format: double */
  SUPERF?: number;
  /** format: double */
  XCENT?: number;
  /** format: double */
  YCENT?: number;
  /** format: double */
  XMAX?: number;
  /** format: double */
  YMAX?: number;
  /** format: double */
  XMIN?: number;
  /** format: double */
  YMIN?: number;
  PUNTS?: string;
  DISTRICTE?: string;
  /** format: date-time */
  DATA?: string;
  /** format: double */
  MIN_AMP_VOR?: number;
  /** format: double */
  MAX_AMP_VOR?: number;
  /** format: int32 */
  EntityState?: EntityStatePolVialEnum;
  /** format: double */
  Id?: number;
}

export type EntityStatePolVialEnum = '2' | '4' | '8' | '16';
