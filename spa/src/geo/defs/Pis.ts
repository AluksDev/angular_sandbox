/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Pis {
  CODI_PIS?: string;
  DESC_PIS?: string;
  /** format: int32 */
  ORDRE?: number;
  /** format: int32 */
  EntityState?: EntityStatePisEnum;
  /** format: double */
  Id?: number;
}

export type EntityStatePisEnum = '2' | '4' | '8' | '16';
