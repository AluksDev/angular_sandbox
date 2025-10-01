/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface TipusEscala {
  CODI_ESC?: string;
  DESC_ESC?: string;
  /** format: int32 */
  EntityState?: EntityStateTipusEscalaEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateTipusEscalaEnum = '2' | '4' | '8' | '16';
