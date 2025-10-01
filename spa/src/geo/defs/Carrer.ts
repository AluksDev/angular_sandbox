/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Carrer {
  NOM_OFICIAL?: string;
  CODI?: string;
  CODI_INE?: string;
  CODI_DGC?: string;
  TIPUS_VIA?: string;
  DESCRIPCIO?: string;
  NOM18?: string;
  NOM27?: string;
  NOM_COMPLET?: string;
  NOM_ORDENAR?: string;
  NOM_INDEX?: string;
  SEQUENCIA?: string;
  APROVACIO?: string;
  /** format: date-time */
  DATA_APROV?: string;
  /** format: int32 */
  EntityState?: EntityStateCarrerEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateCarrerEnum = '2' | '4' | '8' | '16';
