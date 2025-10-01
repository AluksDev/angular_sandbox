/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface TipusDomicili {
  CODI_TIP?: string;
  DESC_TIP?: string;
  ESCALA?: string;
  PLANTA?: string;
  TAULA_ESCALA?: string;
  TAULA_PLANTA?: string;
  TAULA_PORTA?: string;
  PORTA_NUM?: string;
  /** format: int32 */
  EntityState?: EntityStateTipusDomiciliEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateTipusDomiciliEnum = '2' | '4' | '8' | '16';
