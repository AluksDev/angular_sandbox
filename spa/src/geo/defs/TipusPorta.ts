/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface TipusPorta {
  CODI_POR?: string;
  DESC_POR?: string;
  /** format: int32 */
  EntityState?: EntityStateTipusPortaEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateTipusPortaEnum = '2' | '4' | '8' | '16';
