/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface TipusVariant {
  TIPUS_VARIANT?: string;
  AUTOMATICA?: string;
  DESCRIPCIO_N?: string;
  DESCRIPCIO?: string;
  /** format: int32 */
  EntityState?: EntityStateTipusVariantEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateTipusVariantEnum = '2' | '4' | '8' | '16';
