/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Zones {
  CODI_CARR?: string;
  NUMPOST_I?: string;
  LLEPOST_I?: string;
  NUMPOST_F?: string;
  LLEPOST_F?: string;
  TIPUSNUM?: string;
  DISTRICTE?: string;
  CODI_ILLA?: string;
  CODI_PARC?: string;
  DEMARC_GUB?: string;
  /** format: int32 */
  EntityState?: EntityStateZonesEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateZonesEnum = '2' | '4' | '8' | '16';
