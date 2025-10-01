/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Municipi {
  CODI_PROV?: string;
  CODI_MUNI?: string;
  NOM_CATALA?: string;
  NOM_CASTELLA?: string;
  CODI_COMAR?: string;
  /** format: int32 */
  EntityState?: EntityStateMunicipiEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateMunicipiEnum = '2' | '4' | '8' | '16';
