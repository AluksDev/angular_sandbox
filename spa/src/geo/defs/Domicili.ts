/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Domicili {
  CODI_CARR?: string;
  NUMPOST_I?: string;
  LLEPOST_I?: string;
  NUMPOST_F?: string;
  LLEPOST_F?: string;
  TIPUSNUM?: string;
  CODI_ILLA?: string;
  CODI_PARC?: string;
  SOLAR?: string;
  /** format: int32 */
  XNUM_POST?: number;
  /** format: int32 */
  YNUM_POST?: number;
  /** format: double */
  ANGLE?: number;
  DISTRICTE?: string;
  DIST_POST?: string;
  SECC_CENS?: string;
  SECC_EST?: string;
  BARRI?: string;
  /** format: int32 */
  GPL?: number;
  PPALSOLAR?: string;
  PPALGPL?: string;
  /** format: int32 */
  CODI_DOMICILI?: number;
  /** format: int32 */
  CODI_VAR?: number;
  PRINCIPAL?: string;
  ESCALA?: string;
  PLANTA?: string;
  PORTA?: string;
  TIP_DOMICILI?: string;
  DESC_TIP?: string;
  DESC_ESC?: string;
  DESC_PIS?: string;
  DESC_POR?: string;
  /** format: int32 */
  ORD_PIS?: number;
  /** format: int32 */
  EntityState?: EntityStateDomiciliEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateDomiciliEnum = '2' | '4' | '8' | '16';
