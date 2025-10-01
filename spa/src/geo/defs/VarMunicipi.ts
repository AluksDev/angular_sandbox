/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface VarMunicipi {
  CODI_PROV?: string;
  CODI_MUNI?: string;
  VARIANT?: string;
  /** format: int32 */
  EntityState?: EntityStateVarMunicipiEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateVarMunicipiEnum = '2' | '4' | '8' | '16';
