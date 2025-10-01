/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Variant {
  VARIANT?: string;
  CODI?: string;
  TIPUS_VARIANT?: string;
  /** format: date-time */
  DATA_ALTA?: string;
  USU_ALTA?: string;
  /** format: int32 */
  EntityState?: EntityStateVariantEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateVariantEnum = '2' | '4' | '8' | '16';
