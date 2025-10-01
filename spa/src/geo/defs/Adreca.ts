/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

import * as __model from '../model';

export interface Adreca {
  NUMPOST?: string;
  LLEPOST?: string;
  CODI_CARRER?: string;
  /** format: int32 */
  CODI_GEOADRECA?: number;
  PRINCIPAL?: string;
  PRINCIPALGPL?: string;
  CODI_ILLA?: string;
  CODI_SOLAR?: string;
  /** format: int32 */
  GPL?: number;
  TIP_ADRECA?: string;
  ESTAT?: string;
  BIS?: string;
  CFIN?: string;
  HCFIN?: string;
  CIAE?: string;
  HCIAE?: string;
  /** format: int32 */
  CANY?: number;
  ADRECES_CFIN?: __model.AdrecaCFin[];
  ADRECES_CIAE?: __model.AdrecaCIae[];
  /** format: int32 */
  EntityState?: EntityStateAdrecaEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateAdrecaEnum = '2' | '4' | '8' | '16';
