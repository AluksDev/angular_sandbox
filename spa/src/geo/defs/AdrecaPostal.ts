/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface AdrecaPostal {
  CODI?: string;
  CODI_INE?: string;
  CODI_DGC?: string;
  TIPUS_VIA?: string;
  NOM18?: string;
  NOM27?: string;
  NOM_COMPLET?: string;
  NOM_ORDENAR?: string;
  SEQUENCIA?: string;
  APROVACIO?: string;
  /** format: date-time */
  DATA_APROV?: string;
  CODI_CARR?: string;
  NUMPOST_I?: string;
  LLEPOST_I?: string;
  NUMPOST_F?: string;
  LLEPOST_F?: string;
  TIPUSNUM?: string;
  DISTRICTE?: string;
  CODI_ILLA?: string;
  CODI_PARC?: string;
  SOLAR?: string;
  /** format: int32 */
  GPL?: number;
  PRINCIPAL?: string;
  PRINCIPALGPL?: string;
  /** format: int32 */
  XNUM_POST?: number;
  /** format: int32 */
  YNUM_POST?: number;
  /** format: double */
  ANGLE?: number;
  DIST_POST?: string;
  SECC_CENS?: string;
  SECC_EST?: string;
  NOM_OFICIAL?: string;
  BARRI?: string;
  CFIN?: string;
  /** format: int32 */
  CANY?: number;
  /** format: int32 */
  EntityState?: EntityStateAdrecaPostalEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateAdrecaPostalEnum = '2' | '4' | '8' | '16';
