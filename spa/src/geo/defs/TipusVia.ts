/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface TipusVia {
  TIPUS_VIA?: string;
  CODI?: string;
  DESCRIPCIO?: string;
  ENTITAT?: string;
  /** format: int32 */
  EntityState?: EntityStateTipusViaEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateTipusViaEnum = '2' | '4' | '8' | '16';
