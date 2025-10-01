/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface TipusNumeracio {
  TIPUSNUM?: string;
  DESCRIPCIO?: string;
  /** format: int32 */
  EntityState?: EntityStateTipusNumeracioEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateTipusNumeracioEnum = '2' | '4' | '8' | '16';
